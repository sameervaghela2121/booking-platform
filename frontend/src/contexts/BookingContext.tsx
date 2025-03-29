
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Booking, BookingFormData } from '@/types/booking';
import { useAuth } from './AuthContext';

// API URL
const API_URL = 'http://localhost:5000/api';

// Booking state interface
interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

// Initial booking state
const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null
};

// Booking action types
type BookingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Booking[] }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Booking }
  | { type: 'DELETE_SUCCESS'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Booking reducer
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: null
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'ADD_SUCCESS':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        isLoading: false,
        error: null
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create booking context
interface BookingContextProps {
  bookingState: BookingState;
  fetchBookings: () => Promise<void>;
  addBooking: (data: BookingFormData) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

// Booking provider component
interface BookingProviderProps {
  children: React.ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialState);
  const { authState } = useAuth();
  const { toast } = useToast();

  // Fetch bookings when authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBookings();
    }
  }, [authState.isAuthenticated]);

  // Fetch bookings
  const fetchBookings = async (): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to fetch bookings');
      }
      
      // Convert date strings to Date objects
      const bookings = result.bookings.map((booking: any) => ({
        ...booking,
        bookingDate: new Date(booking.bookingDate),
        createdAt: new Date(booking.createdAt)
      }));
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: bookings
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
      
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Add booking
  const addBooking = async (data: BookingFormData): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create booking');
      }
      
      // Convert date strings to Date objects
      const booking = {
        ...result.booking,
        bookingDate: new Date(result.booking.bookingDate),
        createdAt: new Date(result.booking.createdAt)
      };
      
      dispatch({
        type: 'ADD_SUCCESS',
        payload: booking
      });
      
      toast({
        title: 'Booking Created',
        description: 'Your booking has been created successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create booking';
      
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Delete booking
  const deleteBooking = async (id: string): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to delete booking');
      }
      
      dispatch({
        type: 'DELETE_SUCCESS',
        payload: id
      });
      
      toast({
        title: 'Booking Deleted',
        description: 'Your booking has been deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete booking';
      
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        fetchBookings,
        addBooking,
        deleteBooking,
        clearError
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Booking context hook
export const useBooking = (): BookingContextProps => {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  
  return context;
};
