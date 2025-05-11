package com.baggage.repository;

import com.baggage.model.Bag;
import com.baggage.model.BagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BagRepository extends JpaRepository<Bag, BagId> {
    
    @Query("SELECT b FROM Bag b JOIN Flight f ON " +
           "b.id.flightNr = f.id.flightNr AND " +
           "b.id.airlineCodeNr = f.id.airlineCodeNr AND " +
           "b.id.suffix = f.id.suffix AND " +
           "b.id.flightDepDate = f.id.flightDepDate AND " +
           "b.id.legNr = f.id.legNr " +
           "ORDER BY f.scheduleTime ASC, f.estimatedTime ASC, f.actualTime ASC")
    List<Bag> findAllBagsWithFlightInfoOrderByDepartureTime();
} 