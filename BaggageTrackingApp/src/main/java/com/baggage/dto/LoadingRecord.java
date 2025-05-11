package com.baggage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoadingRecord {
    private String flightNumber;
    private String seat;
    private String baggageType; // pet, wheelchair, weapon
    private String status; // loaded, not_loaded
    private boolean hasBoarded;
    private String departureDateTime; // Format: DD/MMM HH:MM
    private String flightStand; // 5 alphanumeric characters
    private String bagtag; // ONINTER_PREFIX + BT_AIRLINE_CODE_NR + BT_SERIAL_NR
} 