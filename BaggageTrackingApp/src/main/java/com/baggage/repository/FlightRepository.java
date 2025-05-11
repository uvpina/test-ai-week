package com.baggage.repository;

import com.baggage.model.Flight;
import com.baggage.model.FlightId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, FlightId> {
} 