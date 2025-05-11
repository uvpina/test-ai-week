package com.baggage.service;

import com.baggage.dto.LoadingRecord;
import com.baggage.model.Bag;
import com.baggage.model.Flight;
import com.baggage.repository.BagRepository;
import com.baggage.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoadingRecordServiceImpl implements LoadingRecordService {

    private final BagRepository bagRepository;
    private final FlightRepository flightRepository;
    
    private static final DateTimeFormatter DEPARTURE_DATE_FORMATTER = 
            DateTimeFormatter.ofPattern("dd/MMM HH:mm");
    
    private static final Set<String> WHEELCHAIR_CODES = Set.of(
            "WCBD", "WCBW", "WCHC", "WCHR", "WCHS", "WCLB"
    );
    
    private static final Set<String> VALID_EXCEPTION_TYPES = new HashSet<String>() {{
        add("PET");
        add("WEAP");
        addAll(WHEELCHAIR_CODES);
    }};
   
    @Override
    public List<LoadingRecord> getSpecialBaggageByDateRange(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        List<Bag> bags = bagRepository.findAllBagsWithFlightInfoOrderByDepartureTime();
        
        // Create a map to store flights by composite key for quick lookup
        Map<String, Flight> flightMap = createFlightMap();
        
        return bags.stream()
                .filter(this::hasRelevantExceptionType)  // Filter for special baggage types
                .filter(bag -> isWithinDateRange(bag, flightMap, fromDateTime, toDateTime))  // Filter by date range
                .map(bag -> mapToLoadingRecord(bag, flightMap))
                .collect(Collectors.toList());
    }
    
    private Map<String, Flight> createFlightMap() {
        return flightRepository.findAll().stream()
                .collect(Collectors.toMap(
                        this::createFlightKey,
                        flight -> flight
                ));
    }
    
    private String createFlightKey(Flight flight) {
        return String.format("%d-%d-%s-%s-%d",
                flight.getId().getFlightNr(),
                flight.getId().getAirlineCodeNr(),
                flight.getId().getSuffix(),
                flight.getId().getFlightDepDate(),
                flight.getId().getLegNr());
    }
    
    private String createBagFlightKey(Bag bag) {
        return String.format("%d-%d-%s-%s-%d",
                bag.getId().getFlightNr(),
                bag.getId().getAirlineCodeNr(),
                bag.getId().getSuffix(),
                bag.getId().getFlightDepDate(),
                bag.getId().getLegNr());
    }
    
    private LoadingRecord mapToLoadingRecord(Bag bag, Map<String, Flight> flightMap) {
        String flightKey = createBagFlightKey(bag);
        Flight flight = flightMap.get(flightKey);
        
        return LoadingRecord.builder()
                .flightNumber(String.valueOf(bag.getId().getFlightNr()))
                .seat(bag.getSeat())
                .baggageType(determineBaggageType(bag.getExceptionTypes()))
                .status(bag.getLoadedStatus() != null && bag.getLoadedStatus() >= 8 ? "loaded" : "not_loaded")
                .hasBoarded(bag.hasBoarded())
                .departureDateTime(formatDepartureDateTime(bag.getId().getFlightDepDate(), flight))
                .flightStand(flight != null ? flight.getStand() : null)
                .bagtag(bag.getBagtag())
                .build();
    }
    
    private String determineBaggageType(String exceptionTypes) {
        if (exceptionTypes == null) {
            return null;
        }
        
        List<String> codes = Arrays.asList(exceptionTypes.split(","));
        
        if (codes.contains("PET")) {
            return "pet";
        } else if (codes.stream().anyMatch(WHEELCHAIR_CODES::contains)) {
            return "wheelchair";
        } else if (codes.contains("WEAP")) {
            return "weapon";
        }
        
        return null;
    }
    
    private String formatDepartureDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DEPARTURE_DATE_FORMATTER);
    }
    
    private String formatDepartureDateTime(java.time.LocalDate date, Flight flight) {
        if (date == null || flight == null) {
            return null;
        }
        
        LocalDateTime bestTime = flight.getBestDepartureTime();
        if (bestTime == null) {
            return null;
        }
        
        // Combine date from bag with time from flight
        LocalDateTime combinedDateTime = LocalDateTime.of(
                date.getYear(),
                date.getMonth(),
                date.getDayOfMonth(),
                bestTime.getHour(),
                bestTime.getMinute()
        );
        
        return combinedDateTime.format(DEPARTURE_DATE_FORMATTER);
    }
    
    private boolean filterRecord(LoadingRecord record, String flightStatus, String passengerType, String baggageStatus) {
        // Apply flight status filter if not "All"
        if (!"All".equalsIgnoreCase(flightStatus)) {
            boolean shouldBeBoarded = "Boarded".equalsIgnoreCase(flightStatus);
            if (record.isHasBoarded() != shouldBeBoarded) {
                return false;
            }
        }
        
        // Apply passenger type filter if not "All"
        if (!"All".equalsIgnoreCase(passengerType)) {
            String normalizedPassengerType = passengerType.toLowerCase();
            if (record.getBaggageType() == null || !record.getBaggageType().equalsIgnoreCase(normalizedPassengerType)) {
                return false;
            }
        } else {
            // Even if passengerType is "All", we still require a valid baggage type
            if (record.getBaggageType() == null) {
                return false;
            }
        }
        
        // Apply baggage status filter if not "All"
        if (!"All".equalsIgnoreCase(baggageStatus)) {
            String normalizedBaggageStatus = baggageStatus.equalsIgnoreCase("Loaded") ? "loaded" : "not_loaded";
            if (!record.getStatus().equals(normalizedBaggageStatus)) {
                return false;
            }
        }
        
        return true;
    }
    
    private boolean hasRelevantExceptionType(Bag bag) {
        if (bag.getExceptionTypes() == null) {
            return false;
        }
        
        List<String> exceptionCodes = Arrays.asList(bag.getExceptionTypes().split(","));
        
        return exceptionCodes.stream()
                .anyMatch(code -> VALID_EXCEPTION_TYPES.contains(code.trim()));
    }
    
    private boolean isWithinDateRange(Bag bag, Map<String, Flight> flightMap, LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        String flightKey = createBagFlightKey(bag);
        Flight flight = flightMap.get(flightKey);
        
        if (flight == null) {
            return false;
        }
        
        LocalDateTime flightDateTime = flight.getBestDepartureTime();
        if (flightDateTime == null) {
            return false;
        }
        
        return (flightDateTime.isEqual(fromDateTime) || flightDateTime.isAfter(fromDateTime)) && 
               (flightDateTime.isEqual(toDateTime) || flightDateTime.isBefore(toDateTime));
    }
} 