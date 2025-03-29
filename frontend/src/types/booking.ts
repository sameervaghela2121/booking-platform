
export type BookingType = 'Full Day' | 'Half Day' | 'Custom';
export type BookingSlot = 'First Half' | 'Second Half';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  bookingDate: Date;
  bookingType: BookingType;
  bookingSlot?: BookingSlot;
  bookingTime?: string;
  userId: string;
  createdAt: Date;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  bookingDate: Date;
  bookingType: BookingType;
  bookingSlot?: BookingSlot;
  bookingTime?: string;
}
