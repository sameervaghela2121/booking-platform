# Booking Platform

A Node.js-based booking platform with authentication and booking management features.

## Features

- User Authentication (Signup/Login)
- Booking Management
  - Full Day Bookings
  - Half Day Bookings
  - Custom Time Bookings
- Conflict Detection
- JWT-based Authentication

## Documentation

### API Documentation

1. **Markdown Documentation**: See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for detailed API documentation.

2. **Swagger Documentation**: Available in [swagger.json](backend/swagger.json)
   - To view the Swagger documentation:
     1. Visit [Swagger Editor](https://editor.swagger.io/)
     2. Copy and paste the contents of swagger.json

3. **Postman Collection**: Available in [postman_collection.json](backend/postman_collection.json)
   - To use the Postman collection:
     1. Open Postman
     2. Click "Import"
     3. Upload postman_collection.json
     4. Set up environment variables:
        - baseUrl: http://localhost:5000
        - authToken: Your JWT token after login

## Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=booking_system
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Database**:
   - Create MySQL database
   - Run the SQL script in `backend/src/config/database.sql`

4. **Start the Server**:
   ```bash
   npm run dev
   ```

## Testing

Run the automated API tests:
```bash
cd backend
node test-api.js
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Authenticate user

### Bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings` - Get user's bookings

For detailed API documentation and examples, refer to the documentation files mentioned above.
