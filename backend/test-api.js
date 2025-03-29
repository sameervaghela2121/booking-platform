const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testEmail = `test${Date.now()}@example.com`;

const test = async () => {
  try {
    console.log('\n1. Testing Signup API...');
    let response = await axios.post(`${API_URL}/auth/signup`, {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'Test@123'
    });
    console.log('✅ Signup successful');
    console.log('📧 Verification email would be sent to:', testEmail);

    // Note: In a real scenario, user would verify email here
    // For testing purposes, let's directly verify the user in the database
    console.log('\n2. Testing Login API...');
    response = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'Test@123'
    });
    authToken = response.data.token;
    console.log('✅ Login successful');
    console.log('🔑 Token received');

    console.log('\n3. Testing Create Booking API...');
    // Test Full Day Booking
    response = await axios.post(
      `${API_URL}/bookings`,
      {
        customerName: 'Test Customer',
        customerEmail: 'customer@example.com',
        bookingDate: '2024-12-20',
        bookingType: 'Full Day'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Full day booking created');

    // Try to create conflicting booking
    try {
      console.log('\n4. Testing Booking Conflict...');
      await axios.post(
        `${API_URL}/bookings`,
        {
          customerName: 'Test Customer 2',
          customerEmail: 'customer2@example.com',
          bookingDate: '2024-12-20',
          bookingType: 'Half Day',
          bookingSlot: 'First Half'
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Booking conflict detected correctly');
      }
    }

    console.log('\n5. Testing Get Bookings API...');
    response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Retrieved bookings successfully');
    console.log('📊 Number of bookings:', response.data.length);

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.error || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    }
    console.error('Full error:', error);
  }
};

// Run tests
console.log('\nStarting API tests...');
test();
