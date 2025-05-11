package com.baggage.controller;

import com.baggage.dto.LoadingRecord;
import com.baggage.service.LoadingRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LoadingRecordController {

    private final LoadingRecordService loadingRecordService;
    
    @GetMapping("/get-special-baggage")
    public ResponseEntity<List<LoadingRecord>> getSpecialBaggageByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        
        List<LoadingRecord> records = loadingRecordService.getSpecialBaggageByDateRange(from, to);
        return ResponseEntity.ok(records);
    }
} 