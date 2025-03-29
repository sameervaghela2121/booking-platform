
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';

const BookingList: React.FC = () => {
  const { bookingState, fetchBookings } = useBooking();
  
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  
  if (bookingState.isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <p>Loading bookings...</p>
      </div>
    );
  }
  
  if (bookingState.bookings.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p>No bookings found. Create a new booking to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Bookings</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {bookingState.bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle className="text-lg">{booking.customerName}</CardTitle>
              <CardDescription>{booking.customerEmail}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(booking.bookingDate), 'PPP')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.bookingType === 'Full Day' && 'Full Day'}
                    {booking.bookingType === 'Half Day' && `Half Day (${booking.bookingSlot})`}
                    {booking.bookingType === 'Custom' && `Custom (${booking.bookingTime})`}
                  </span>
                </li>
                <li className="text-xs text-muted-foreground mt-2">
                  Created on {format(new Date(booking.createdAt), 'PPP')}
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
