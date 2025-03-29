# Booking Platform

A comprehensive booking management system built with Node.js, Express, and MySQL, featuring user authentication and various booking types.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Common Issues & Solutions](#common-issues--solutions)

## Features

### Authentication
- User registration with email verification
- JWT-based authentication
- Secure password hashing using bcrypt

### Booking Management
- Multiple booking types:
  - Full Day Bookings
  - Half Day Bookings (Morning/Afternoon slots)
  - Custom Time Bookings
- Automatic conflict detection
- Email notifications
- User-specific booking history

## Prerequisites

1. **Node.js and npm**
   ```bash
   # Check if installed
   node --version  # Should be >= 14.0.0
   npm --version   # Should be >= 6.0.0

   # Install if needed (Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **MySQL**
   ```bash
   # Install MySQL (Ubuntu/Debian)
   sudo apt update
   sudo apt install mysql-server

   # Start MySQL service
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

3. **Git**
   ```bash
   # Install Git (Ubuntu/Debian)
   sudo apt update
   sudo apt install git
   ```

## Technology Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **API Testing**: Axios
- **Development Tools**: nodemon

## Project Structure

```
booking-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.sql   # Database schema
│   │   │   └── db.js         # Database connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── bookingController.js
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT authentication
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   └── booking.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── booking.js
│   │   ├── utils/
│   │   │   └── email.js      # Email utilities
│   │   └── server.js         # Main application file
│   ├── test-api.js           # API tests
│   ├── swagger.json          # Swagger documentation
│   ├── postman_collection.json
│   └── package.json
└── README.md
```

## Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sameervaghela2121/booking-platform.git
   cd booking-platform
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

   Dependencies list:
   - express: ^4.18.2
   - mysql2: ^3.6.5
   - bcryptjs: ^2.4.3
   - jsonwebtoken: ^9.0.2
   - dotenv: ^16.3.1
   - nodemailer: ^6.9.7
   - cors: ^2.8.5
   - express-validator: ^7.0.1
   - nodemon: ^2.0.22 (dev dependency)
   - axios: ^1.6.2 (dev dependency)

## Database Setup

1. **Access MySQL**
   ```bash
   sudo mysql -u root -p
   ```

2. **Create Database and User**
   ```sql
   CREATE DATABASE booking_system;
   CREATE USER 'booking_user'@'localhost' IDENTIFIED BY 'Booking@123Password';
   GRANT ALL PRIVILEGES ON booking_system.* TO 'booking_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Import Schema**
   ```bash
   # From the backend directory
   sudo mysql -u booking_user -p booking_system < src/config/database.sql
   ```

## Configuration

1. **Create Environment File**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=booking_user
   DB_PASSWORD=Booking@123Password
   DB_NAME=booking_system
   JWT_SECRET=your-secret-key
   
   # Email Configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   ```

   Note: For Gmail, you'll need to:
   1. Enable 2-factor authentication
   2. Generate an app-specific password
   3. Use the app-specific password in SMTP_PASS

## Running the Application

1. **Development Mode**
   ```bash
   cd backend
   npm run dev
   ```

2. **Production Mode**
   ```bash
   cd backend
   npm start
   ```

The server will start on http://localhost:5000

## API Documentation

1. **Markdown Documentation**
   - See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

2. **Swagger Documentation**
   - Open [Swagger Editor](https://editor.swagger.io/)
   - Import [swagger.json](backend/swagger.json)

3. **Postman Collection**
   - Import [postman_collection.json](backend/postman_collection.json)
   - Set environment variables:
     - baseUrl: http://localhost:5000
     - authToken: (obtained after login)

## Testing

1. **Run API Tests**
   ```bash
   cd backend
   node test-api.js
   ```

2. **Manual Testing with Postman**
   - Import the Postman collection
   - Test endpoints in this order:
     1. Sign Up
     2. Login (save the token)
     3. Create Booking
     4. Get Bookings

## Common Issues & Solutions

1. **MySQL Connection Issues**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Restart MySQL if needed
   sudo systemctl restart mysql
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   sudo lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Email Sending Issues**
   - Verify SMTP credentials
   - Check if less secure app access is enabled (Gmail)
   - Ensure proper app-specific password

4. **JWT Token Issues**
   - Check if token is included in Authorization header
   - Verify token format: "Bearer <token>"
   - Ensure JWT_SECRET matches in .env

## Support

For issues and feature requests, please create an issue in the GitHub repository.
