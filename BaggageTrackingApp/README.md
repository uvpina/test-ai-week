# Baggage Tracking Application

This is a Spring Boot application that exposes a REST API for serving baggage loading records to a React frontend.

## Architecture

The application follows a layered architecture:

- **Controller Layer**: Handles incoming HTTP requests and returns JSON responses
- **Service Layer**: Contains business logic for transforming and filtering data
- **Repository Layer**: Interfaces with the database using Spring Data JPA
- **Entity/DTO Layer**: Contains JPA entities and data transfer objects

## Key Features

- REST API for retrieving loading records with filtering
- JPA entities mapping to TBAG and TFLIGHT tables
- Transformation logic to map database fields to frontend requirements
- Filtering by flight status, passenger type, and baggage status
- Automatic filtering to only include records with special exception types (pet, wheelchair, weapon)
- Date range filtering for special baggage

## API Endpoints

### GET /api/loading-records

Retrieves a list of loading records, with optional filters:

- `flightStatus`: "All", "Boarded", or "Not Boarded"
- `passengerType`: "All", "Pet", "Wheelchair", or "Weapon"
- `baggageStatus`: "All", "Loaded", or "Not Loaded"

**Note**: Only records with special exception types (PET, WCHR/WCHS/etc., WEAP) are included in the response.

Response is an array of `LoadingRecord` objects with the following structure:

```json
[
  {
    "flightNumber": "101",
    "seat": "A12",
    "baggageType": "pet",
    "status": "loaded",
    "hasBoarded": true,
    "departureDateTime": "15/Jun 08:20",
    "flightStand": "A12",
    "bagtag": "1111001"
  }
]
```

### GET /api/get-special-baggage

Retrieves a list of special baggage records (pet, wheelchair, weapon) within a specified date/time range:

- `from`: The start of the date/time range in ISO-8601 format (e.g., "2023-06-15T00:00:00Z")
- `to`: The end of the date/time range in ISO-8601 format (e.g., "2023-06-16T00:00:00Z")

The response format is the same as the `/api/loading-records` endpoint.

Example:
```
GET /api/get-special-baggage?from=2023-06-15T00:00:00Z&to=2023-06-16T00:00:00Z
```

## Running the Application

1. Make sure you have Java 17 or later installed
2. Build the application: `mvn clean package`
3. Run the application: `java -jar target/baggage-tracking-app-0.0.1-SNAPSHOT.jar`
4. The API will be available at http://localhost:8080/api/loading-records

## Testing

The application includes integration tests for the controller using MockMVC:

```
mvn test
```

## Database

The application uses an H2 in-memory database with schema initialized from schema.sql and data.sql files.

You can access the H2 console at http://localhost:8080/h2-console (credentials in application.properties). 