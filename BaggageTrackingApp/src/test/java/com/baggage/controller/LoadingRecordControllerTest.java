package com.baggage.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import org.hamcrest.Matchers;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.stream.Collectors;

@SpringBootTest
@AutoConfigureMockMvc
public class LoadingRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllLoadingRecords() throws Exception {
        mockMvc.perform(get("/api/loading-records")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }

    @Test
    public void testFilterByFlightStatus() throws Exception {
        mockMvc.perform(get("/api/loading-records")
                .param("flightStatus", "Boarded")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].hasBoarded", everyItem(is(true))))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }

    @Test
    public void testFilterByPassengerType() throws Exception {
        mockMvc.perform(get("/api/loading-records")
                .param("passengerType", "Pet")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].baggageType", everyItem(is("pet"))));
    }

    @Test
    public void testFilterByBaggageStatus() throws Exception {
        mockMvc.perform(get("/api/loading-records")
                .param("baggageStatus", "Loaded")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].status", everyItem(is("loaded"))))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }

    @Test
    public void testMultipleFilters() throws Exception {
        mockMvc.perform(get("/api/loading-records")
                .param("flightStatus", "Boarded")
                .param("baggageStatus", "Loaded")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].hasBoarded", everyItem(is(true))))
                .andExpect(jsonPath("$[*].status", everyItem(is("loaded"))))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }

    @Test
    public void testGetSpecialBaggageByDateRange() throws Exception {
        mockMvc.perform(get("/api/get-special-baggage")
                .param("from", "2023-06-15T00:00:00Z")
                .param("to", "2023-06-16T00:00:00Z")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }

    @Test
    public void testGetSpecialBaggageWithSpecificDateRange() throws Exception {
        mockMvc.perform(get("/api/get-special-baggage")
                .param("from", "2023-06-15T08:00:00Z")
                .param("to", "2023-06-15T10:00:00Z")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].baggageType", everyItem(isOneOf("pet", "wheelchair", "weapon"))));
    }
    
    private org.hamcrest.Matcher<String> isOneOf(String... values) {
        return anyOf(
            Arrays.stream(values)
                .map(Matchers::is)
                .collect(Collectors.toList())
        );
    }
}