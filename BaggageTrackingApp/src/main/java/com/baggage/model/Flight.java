package com.baggage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "TFLIGHT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
    
    @EmbeddedId
    private FlightId id;
    
    @Column(name = "LEG_DEP_DATE", nullable = false)
    private LocalDate legDepDate;
    
    @Column(name = "NR_LEGS")
    private Short nrLegs;
    
    @Column(name = "FLIGHT_ORIGIN", length = 5)
    private String flightOrigin;
    
    @Column(name = "FLIGHT_DESTINATION", length = 5)
    private String flightDestination;
    
    @Column(name = "LEG_ORIGIN", nullable = false, length = 5)
    private String legOrigin;
    
    @Column(name = "LEG_DESTINATION", length = 5)
    private String legDestination;
    
    @Column(name = "LOAD_STRATEGY", nullable = false, length = 3)
    private String loadStrategy;
    
    @Column(name = "FLIGHT_STATUS")
    private Short flightStatus;
    
    @Column(name = "EMERGENCY_STATUS")
    private Short emergencyStatus;
    
    @Column(name = "UNTAGGED_CREW_BAGS")
    private Short untaggedCrewBags;
    
    @Column(name = "IS_FALLBACK_MODE", length = 1)
    private String isFallbackMode;
    
    @Column(name = "AIRCRAFT_TYPE", length = 1)
    private String aircraftType;
    
    @Column(name = "FMM_RECV_TIMESTAMP")
    private LocalDateTime fmmRecvTimestamp;
    
    @Column(name = "FLIGHT_FLAG")
    private Integer flightFlag;
    
    @Column(name = "SCHEDULE_TIME")
    private LocalDateTime scheduleTime;
    
    @Column(name = "ESTIMATED_TIME")
    private LocalDateTime estimatedTime;
    
    @Column(name = "ACTUAL_TIME")
    private LocalDateTime actualTime;
    
    @Column(name = "GATE", length = 5)
    private String gate;
    
    @Column(name = "STAND", length = 5)
    private String stand;
    
    @Column(name = "TERMINAL", length = 12)
    private String terminal;
    
    @Column(name = "FIDS_AIRCRAFT_TYPE", length = 5)
    private String fidsAircraftType;
    
    @Column(name = "AIRCRAFT_REGISTRATION", length = 12)
    private String aircraftRegistration;
    
    @Column(name = "BEST_DEPARTURE_TIME_UTC")
    private LocalDateTime bestDepartureTimeUtc;
    
    // Helper method to get the best available departure time
    public LocalDateTime getBestDepartureTime() {
        if (actualTime != null) {
            return actualTime;
        } else if (estimatedTime != null) {
            return estimatedTime;
        } else {
            return scheduleTime;
        }
    }
} 