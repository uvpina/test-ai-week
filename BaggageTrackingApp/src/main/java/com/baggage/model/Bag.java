package com.baggage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "TBAG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bag {
    
    @EmbeddedId
    private BagId id;
    
    @Column(name = "LEG_DEP_DATE", nullable = false)
    private LocalDate legDepDate;
    
    @Column(name = "LEG_ORIGIN", nullable = false, length = 5)
    private String legOrigin;
    
    @Column(name = "BAG_LEG_SEQ_NR", nullable = false)
    private Short bagLegSeqNr;
    
    @Column(name = "LOAD_DEVICE", nullable = false, length = 11)
    private String loadDevice;
    
    @Column(name = "BAG_STATUS", nullable = false)
    private Short bagStatus;
    
    @Column(name = "BAG_FLAG")
    private BigInteger bagFlag;
    
    @Column(name = "BAG_POSITION")
    private Short bagPosition;
    
    @Column(name = "BAG_CHARACTERISTIC", length = 2)
    private String bagCharacteristic;
    
    @Column(name = "CLASS_OF_TRAVEL", length = 1)
    private String classOfTravel;
    
    @Column(name = "DESTINATION", length = 5)
    private String destination;
    
    @Column(name = "SURNAME", length = 64)
    private String surname;
    
    @Column(name = "GROUP_NAME", length = 20)
    private String groupName;
    
    @Column(name = "SEAT", length = 3)
    private String seat;
    
    @Column(name = "PAX_STATUS", length = 3)
    private String paxStatus;
    
    @Column(name = "SEQUENCE_NR")
    private Short sequenceNr;
    
    @Column(name = "SECURITY_NR")
    private Short securityNr;
    
    @Column(name = "SECURITY_SCREENING", length = 60)
    private String securityScreening;
    
    @Column(name = "FREQ_TRAVELLER_ID", length = 30)
    private String freqTravellerId;
    
    @Column(name = "IB_AIRL_DSGNTR", length = 3)
    private String ibAirlDsgntr;
    
    @Column(name = "IB_FLIGHT_NR")
    private Short ibFlightNr;
    
    @Column(name = "IB_SUFFIX", length = 1)
    private String ibSuffix;
    
    @Column(name = "IB_DEPARTURE_DATE")
    private LocalDate ibDepartureDate;
    
    @Column(name = "IB_ORIGIN", length = 5)
    private String ibOrigin;
    
    @Column(name = "OW_AIRL_DSGNTR", length = 3)
    private String owAirlDsgntr;
    
    @Column(name = "OW_FLIGHT_NR")
    private Short owFlightNr;
    
    @Column(name = "OW_SUFFIX", length = 1)
    private String owSuffix;
    
    @Column(name = "OW_DEPARTURE_DATE")
    private LocalDate owDepartureDate;
    
    @Column(name = "OW_DESTINATION", length = 5)
    private String owDestination;
    
    @Column(name = "CS_AIRL_DSGNTR", length = 3)
    private String csAirlDsgntr;
    
    @Column(name = "CS_FLIGHT_NR")
    private Short csFlightNr;
    
    @Column(name = "CS_SUFFIX", length = 1)
    private String csSuffix;
    
    @Column(name = "PNR_ADDRESS", length = 6)
    private String pnrAddress;
    
    @Column(name = "FREE_TEXT", length = 64)
    private String freeText;
    
    @Column(name = "TIME_BSM_RECEIVED")
    private LocalDateTime timeBsmReceived;
    
    @Column(name = "TIME_BAG_LOADED")
    private LocalDateTime timeBagLoaded;
    
    @Column(name = "BAG_WEIGHT")
    private Float bagWeight;
    
    @Column(name = "OW_AIRL_DSGNTR2", length = 3)
    private String owAirlDsgntr2;
    
    @Column(name = "OW_FLIGHT_NR2")
    private Short owFlightNr2;
    
    @Column(name = "OW_SUFFIX2", length = 1)
    private String owSuffix2;
    
    @Column(name = "OW_DEPARTURE_DATE2")
    private LocalDate owDepartureDate2;
    
    @Column(name = "OW_DESTINATION2", length = 5)
    private String owDestination2;
    
    @Column(name = "MAPPED_CLASS_OF_TRAVEL", length = 1)
    private String mappedClassOfTravel;
    
    @Column(name = "AUTHORITY_TO_LOAD", length = 1)
    private String authorityToLoad;
    
    @Column(name = "PAX_PROFILE", length = 1)
    private String paxProfile;
    
    @Column(name = "AUTHORITY_TO_TRANSPORT", length = 1)
    private String authorityToTransport;
    
    @Column(name = "BAG_TAG_STATUS", length = 1)
    private String bagTagStatus;
    
    @Column(name = "EXCEPTION_TYPES", length = 450)
    private String exceptionTypes;
    
    @Column(name = "SPECIAL_INSTRUCTIONS", length = 255)
    private String specialInstructions;
    
    @Column(name = "LAST_KNOWN_LOCATION", length = 100)
    private String lastKnownLocation;
    
    @Column(name = "LAST_KNOWN_LOCATION_DESC", length = 500)
    private String lastKnownLocationDesc;
    
    @Column(name = "LAST_KNOWN_TIMESTAMP_UTC")
    private LocalDateTime lastKnownTimestampUtc;
    
    @Column(name = "BAG_ALERTS")
    private Integer bagAlerts;
    
    @Column(name = "UNIT_POSITION", length = 5)
    private String unitPosition;
    
    @Column(name = "LOADED_STATUS")
    private Integer loadedStatus;
    
    @Column(name = "COMMODITY_TYPE", length = 5)
    private String commodityType;
    
    // Helper method to get bagtag
    public String getBagtag() {
        if (id != null) {
            return String.format("%d%d%d", id.getOninterPrefix(), id.getBtAirlineCodeNr(), id.getBtSerialNr());
        }
        return null;
    }
    
    // Helper method to check if passenger has boarded
    public boolean hasBoarded() {
        return paxStatus != null && "B".equals(paxStatus.trim());
    }
} 