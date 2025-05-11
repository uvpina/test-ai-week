'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSpecialBaggage, LoadingRecord } from '@/lib/api/loading-records';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import FilterBar from '@/components/FilterBar';
import BaggageCardList from '@/components/BaggageCardList';
import { useSettings } from '@/lib/context/settings-context';

export default function DashboardPage() {
  const { lookupTimeRangePast, lookupTimeRangeFuture } = useSettings();
  
  const [filters, setFilters] = useState({
    flightStatus: 'All',
    passengerType: 'All',
    baggageStatus: 'All',
  });
  
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [filteredRecords, setFilteredRecords] = useState<LoadingRecord[]>([]);

  // Fetch data from the API with date range parameters only
  const { data: loadedRecords, isLoading, error } = useQuery({
    queryKey: ['specialBaggage', lookupTimeRangePast, lookupTimeRangeFuture],
    queryFn: () => fetchSpecialBaggage({
      flightStatus: 'All',
      passengerType: 'All',
      baggageStatus: 'All',
      timeRangePast: lookupTimeRangePast,
      timeRangeFuture: lookupTimeRangeFuture
    }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Apply filters locally without making another API call
  useEffect(() => {
    if (loadedRecords) {
      let filtered = [...loadedRecords];
      
      // Apply passenger status filter
      if (filters.flightStatus !== 'All') {
        filtered = filtered.filter(record => {
          if (filters.flightStatus === 'Boarded') return record.hasBoarded;
          if (filters.flightStatus === 'Not Boarded') return !record.hasBoarded;
          return true;
        });
      }
      
      // Apply baggage type filter
      if (filters.passengerType !== 'All') {
        filtered = filtered.filter(record => {
          if (filters.passengerType === 'Pet') return record.baggageType === 'pet';
          if (filters.passengerType === 'Wheelchair') return record.baggageType === 'wheelchair';
          if (filters.passengerType === 'Weapon') return record.baggageType === 'weapon';
          return true;
        });
      }
      
      // Apply loading status filter
      if (filters.baggageStatus !== 'All') {
        filtered = filtered.filter(record => {
          if (filters.baggageStatus === 'Loaded') return record.status === 'loaded';
          if (filters.baggageStatus === 'Not Loaded') return record.status === 'not_loaded';
          return true;
        });
      }
      
      setFilteredRecords(filtered);
    }
  }, [loadedRecords, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  
  // Generate alert message for passengers who have boarded but their baggage is not loaded
  useEffect(() => {
    if (filteredRecords && filteredRecords.length > 0) {
      const alertRecords = filteredRecords.filter(
        (record) => record.hasBoarded && record.status === 'not_loaded'
      );
      
      if (alertRecords.length > 0) {
        // Parse dates to find the record with the closest departure time
        const getCurrentTime = () => new Date();
        
        // Function to convert departure time string to Date object
        const parseDateTime = (dateTimeStr: string) => {
          const [datePart, timePart] = dateTimeStr.split(' ');
          const [day, month] = datePart.split('/');
          const [hour, minute] = timePart.split(':');
          
          const monthsMap: Record<string, number> = {
            'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
            'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
          };
          
          return new Date(
            new Date().getFullYear(),
            monthsMap[month],
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );
        };
        
        // Sort records by closest departure time
        alertRecords.sort((a, b) => {
          const dateA = parseDateTime(a.departureDateTime);
          const dateB = parseDateTime(b.departureDateTime);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Get the record with the closest departure time
        const closestRecord = alertRecords[0];
        const baggageTypeMap: Record<string, string> = {
          'pet': 'Pet',
          'wheelchair': 'Wheelchair',
          'weapon': 'Weapon'
        };
        
        setAlertMessage(`Passenger ${closestRecord.seat} has boarded, but ${baggageTypeMap[closestRecord.baggageType]} is not loaded`);
      } else {
        setAlertMessage(null);
      }
    } else {
      setAlertMessage(null);
    }
  }, [filteredRecords]);

  // Set an alert message if the lookup time range settings have changed
  useEffect(() => {
    if (lookupTimeRangePast !== 24 || lookupTimeRangeFuture !== 24) {
      setAlertMessage(`Showing records from ${lookupTimeRangePast} hours ago to ${lookupTimeRangeFuture} hours in advance`);
    } else {
      setAlertMessage(null);
    }
  }, [lookupTimeRangePast, lookupTimeRangeFuture]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="SPECIAL BAGGAGE LOADING" />
        {alertMessage && <AlertBanner message={alertMessage} />}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <main className="flex-1 p-4 overflow-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {isLoading ? (
            <div style={{ color: 'var(--text-primary)' }}>Loading...</div>
          ) : error ? (
            <div style={{ color: 'var(--text-primary)' }}>Error loading data</div>
          ) : (
            <BaggageCardList records={filteredRecords || []} />
          )}
        </main>
      </div>
    </div>
  );
} 