import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Booking, BookingFormData } from '@/types/booking';
import { useAuth } from './AuthContext';
import { bookingApi, handleApiError } from '@/services/api';

// API URL
const API_URL = 'http://localhost:5001/api';

// Booking state interface
interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

// Initial booking state
const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
  initialized: false
};

// Booking action types
type BookingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Booking[] }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Booking }
  | { type: 'DELETE_SUCCESS'; payload: string }
  | { type: 'SET_INITIALIZED' }
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
    case 'SET_INITIALIZED':
      return {
        ...state,
        initialized: true
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

  // Fetch bookings
  const fetchBookings = useCallback(async (): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const bookings = await bookingApi.getBookings();
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: bookings
      });
    } catch (error) {
      const message = handleApiError(error);
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      if (!bookingState.initialized) {
        dispatch({ type: 'SET_INITIALIZED' });
      }
    }
  }, [authState.isAuthenticated, bookingState.initialized, toast]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !bookingState.initialized) {
      fetchBookings();
    }
  }, [authState.isAuthenticated, bookingState.initialized, fetchBookings]);

  // Add booking
  const addBooking = useCallback(async (data: BookingFormData): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const booking = await bookingApi.createBooking(data);
      dispatch({
        type: 'ADD_SUCCESS',
        payload: booking
      });
      toast({
        title: 'Success',
        description: 'Booking created successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = handleApiError(error);
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
  }, [authState.isAuthenticated, toast]);

  // Delete booking
  const deleteBooking = useCallback(async (id: string): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      await bookingApi.deleteBooking(id);
      dispatch({
        type: 'DELETE_SUCCESS',
        payload: id
      });
      toast({
        title: 'Success',
        description: 'Booking deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = handleApiError(error);
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
  }, [authState.isAuthenticated, toast]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <BookingContext.Provider value={{
      bookingState,
      fetchBookings,
      addBooking,
      deleteBooking,
      clearError
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Booking context hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
