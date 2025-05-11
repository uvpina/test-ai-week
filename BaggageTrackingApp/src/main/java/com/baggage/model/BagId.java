package com.baggage.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class BagId implements Serializable {
    private Integer btSerialNr;
    private Short btAirlineCodeNr;
    private Short oninterPrefix;
    private Short duplicateNr;
    private Short flightNr;
    private Short airlineCodeNr;
    private Character suffix;
    private LocalDate flightDepDate;
    private Short legNr;
} 