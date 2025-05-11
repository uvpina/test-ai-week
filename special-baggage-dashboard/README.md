# Special Baggage Loading Dashboard

A modern, responsive dashboard for tracking special baggage loading status built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Real-time tracking of special baggage loading status
- Filter by flight status, passenger type, and baggage status
- Responsive design for all device sizes
- Accessible UI with proper ARIA attributes
- Smooth animations using Framer Motion

## Tech Stack

- Next.js
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations
- React Query for data fetching and state management

## Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/your-username/special-baggage-dashboard.git
   cd special-baggage-dashboard
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Contract

The dashboard expects a REST API endpoint at `/api/loading-records` that returns data in the following format:

```typescript
interface LoadingRecord {
  flightNumber: string;  // e.g., "DL123"
  seat: string;          // e.g., "8A"
  baggageType: 'pet' | 'wheelchair' | 'weapon';
  status: 'loaded' | 'not_loaded';
  hasBoarded: boolean;
}
```

The API supports the following query parameters:
- `flightStatus`: "All" | "Boarded" | "Not Boarded"
- `passengerType`: "All" | "Pet" | "Wheelchair" | "Weapon"
- `baggageStatus`: "All" | "Loaded" | "Not Loaded"

Example request:
```
GET /api/loading-records?passengerType=Pet&baggageStatus=Not%20Loaded
```

## License

MIT 