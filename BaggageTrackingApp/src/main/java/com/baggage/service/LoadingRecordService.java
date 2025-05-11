package com.baggage.service;

import com.baggage.dto.LoadingRecord;

import java.time.LocalDateTime;
import java.util.List;
 
public interface LoadingRecordService {
    List<LoadingRecord> getSpecialBaggageByDateRange(LocalDateTime fromDateTime, LocalDateTime toDateTime);
} 