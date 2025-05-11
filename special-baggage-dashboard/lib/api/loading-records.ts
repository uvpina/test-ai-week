import axios from 'axios';

export interface LoadingRecord {
  flightNumber: string;
  seat: string;
  baggageType: 'pet' | 'wheelchair' | 'weapon';
  status: 'loaded' | 'not_loaded';
  hasBoarded: boolean;
  departureDateTime: string; // Format: DD/MMM HH:MM (e.g., 28/FEB 23:30)
  flightStand: string; // 5 alphanumeric characters
  bagtag: string; // Baggage identification number
}

interface FilterOptions {
  flightStatus: string;
  passengerType: string;
  baggageStatus: string;
  timeRangePast?: number;
  timeRangeFuture?: number;
}

// Backend API URL - adjust port if your Spring Boot app runs on a different port
const API_BASE_URL = 'http://localhost:8080/api';

// Function to convert local date to UTC
const getUTCDate = (hoursOffset: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + hoursOffset);
  return date.toISOString();
};

// New function to fetch special baggage data with UTC date range
export const fetchSpecialBaggage = async (filters: FilterOptions): Promise<LoadingRecord[]> => {
  try {
    // Calculate date range based on lookupTimeRange settings
    const fromDateTime = getUTCDate(-(filters.timeRangePast || 24));
    const toDateTime = getUTCDate(filters.timeRangeFuture || 24);
    
    // Make API call to the backend with date range parameters
    const response = await axios.get(`${API_BASE_URL}/get-special-baggage`, {
      params: {
        from: fromDateTime,
        to: toDateTime
      }
    });
    
    // Return the raw data - filtering will be handled by the component
    return response.data;
  } catch (error) {
    console.error('Error fetching special baggage records:', error);
    throw error;
  }
};

// Legacy function alias for backward compatibility
export const fetchLoadingRecords = fetchSpecialBaggage;

/* 
// This is the original function with mock data that has been commented out
export const fetchLoadingRecords = async (filters: FilterOptions): Promise<LoadingRecord[]> => {
  // Simulate API call with mock data for now
  // In a real app, this would be:
  // return axios.get('/api/loading-records', { params: filters }).then(res => res.data);
  
  // Mock data that matches the UI design
  const mockData: LoadingRecord[] = [
    {
      flightNumber: 'DL123',
      seat: '8A',
      baggageType: 'pet',
      status: 'not_loaded',
      hasBoarded: true,
      departureDateTime: '28/FEB 23:30',
      flightStand: 'A23B5',
      bagtag: 'BAG1234'
    },
    {
      flightNumber: 'AA245',
      seat: '12C',
      baggageType: 'wheelchair',
      status: 'not_loaded',
      hasBoarded: true,
      departureDateTime: '01/MAR 06:15',
      flightStand: 'C12D4',
      bagtag: 'BAG5678'
    },
    {
      flightNumber: 'UA360',
      seat: '3F',
      baggageType: 'weapon',
      status: 'loaded',
      hasBoarded: false,
      departureDateTime: '28/FEB 15:45',
      flightStand: 'B45F2',
      bagtag: 'BAG9012'
    },
    {
      flightNumber: 'BA789',
      seat: '5D',
      baggageType: 'wheelchair',
      status: 'loaded',
      hasBoarded: true,
      departureDateTime: '02/MAR 10:20',
      flightStand: 'E17A3',
      bagtag: 'BAG3456'
    },
    {
      flightNumber: 'LH550',
      seat: '17A',
      baggageType: 'pet',
      status: 'not_loaded',
      hasBoarded: false,
      departureDateTime: '01/MAR 14:55',
      flightStand: 'D31C7',
      bagtag: 'BAG7890'
    },
    {
      flightNumber: 'AC410',
      seat: '20B',
      baggageType: 'weapon',
      status: 'not_loaded',
      hasBoarded: true,
      departureDateTime: '28/FEB 22:10',
      flightStand: 'F09E1',
      bagtag: 'BAG2345'
    },
    {
      flightNumber: 'AC410',
      seat: '20B',
      baggageType: 'pet',
      status: 'not_loaded',
      hasBoarded: false,
      departureDateTime: '28/FEB 22:10',
      flightStand: 'F09E1',
      bagtag: 'BAG6789'
    }
  ];

  // Apply filters
  let filteredData = [...mockData];
  
  // Add filter for 'Boarded' and 'Not Boarded'
  if (filters.flightStatus !== 'All') {
    filteredData = filteredData.filter(record => {
      if (filters.flightStatus === 'Boarded') return record.hasBoarded;
      if (filters.flightStatus === 'Not Boarded') return !record.hasBoarded;
      return true;
    });
  }
  
  if (filters.passengerType !== 'All') {
    filteredData = filteredData.filter(record => {
      if (filters.passengerType === 'Pet') return record.baggageType === 'pet';
      if (filters.passengerType === 'Wheelchair') return record.baggageType === 'wheelchair';
      if (filters.passengerType === 'Weapon') return record.baggageType === 'weapon';
      return true;
    });
  }
  
  if (filters.baggageStatus !== 'All') {
    filteredData = filteredData.filter(record => {
      if (filters.baggageStatus === 'Loaded') return record.status === 'loaded';
      if (filters.baggageStatus === 'Not Loaded') return record.status === 'not_loaded';
      return true;
    });
  }

  // Sort by departure date/time
  filteredData.sort((a, b) => {
    // Extract date and time components
    const [dateA, timeA] = a.departureDateTime.split(' ');
    const [dateB, timeB] = b.departureDateTime.split(' ');

    // Parse dates (DD/MMM format)
    const [dayA, monthA] = dateA.split('/');
    const [dayB, monthB] = dateB.split('/');

    // Convert month names to numbers
    const monthsMap: Record<string, number> = {
      'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
    };

    // Create Date objects for comparison
    const dateObjA = new Date(new Date().getFullYear(), monthsMap[monthA], parseInt(dayA), 
      parseInt(timeA.split(':')[0]), parseInt(timeA.split(':')[1]));
    const dateObjB = new Date(new Date().getFullYear(), monthsMap[monthB], parseInt(dayB), 
      parseInt(timeB.split(':')[0]), parseInt(timeB.split(':')[1]));

    return dateObjA.getTime() - dateObjB.getTime();
  });

  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
      resolve(filteredData);
    }, 500);
  });
};
*/ 