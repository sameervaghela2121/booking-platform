const Booking = require('../models/booking');

exports.createBooking = async (req, res) => {
  try {
    const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;
    const userId = req.user.userId;

    console.log('Creating booking:', {
      userId,
      customerName,
      customerEmail,
      bookingDate,
      bookingType,
      bookingSlot,
      bookingTime
    });

    // Check for booking conflicts
    const hasConflict = await Booking.checkConflict(bookingDate, bookingType, bookingSlot, bookingTime);
    console.log('Conflict check result:', hasConflict);
    
    if (hasConflict) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create booking
    const bookingId = await Booking.create(
      userId,
      customerName,
      customerEmail,
      bookingDate,
      bookingType,
      bookingSlot,
      bookingTime
    );

    console.log('Booking created:', { bookingId });

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching bookings for user:', userId);
    
    const bookings = await Booking.getBookingsByUserId(userId);
    console.log('Found bookings:', bookings.length);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error in getBookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};
