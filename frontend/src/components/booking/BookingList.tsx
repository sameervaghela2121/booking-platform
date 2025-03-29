import React, { useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookingList: React.FC = () => {
  const { bookingState, deleteBooking } = useBooking();
  const { toast } = useToast();

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteBooking(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteBooking, toast]);
  
  if (bookingState.isLoading && !bookingState.initialized) {
    return (
      <div className="w-full p-8 text-center">
        <p>Loading bookings...</p>
      </div>
    );
  }
  
  if (!bookingState.bookings || bookingState.bookings.length === 0) {
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
          booking && (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                    <CardDescription>{booking.customerEmail}</CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        disabled={bookingState.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(booking.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={bookingState.isLoading}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.bookingDate ? format(booking.bookingDate, 'PPP') : 'Invalid date'}</span>
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
                    Created on {booking.createdAt ? format(booking.createdAt, 'PPP') : 'Invalid date'}
                  </li>
                </ul>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default BookingList;
