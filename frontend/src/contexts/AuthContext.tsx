
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthState, LoginData, SignUpData, User, AuthResponse } from '@/types/auth';

// API URL
const API_URL = 'http://localhost:5000/api';

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null
};

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
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

// Create auth context
interface AuthContextProps {
  authState: AuthState;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  verifyEmail: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Check for token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      try {
        // Set token in headers
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        // Get user profile
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: data.user
        });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({
          type: 'AUTH_FAIL',
          payload: 'Authentication failed'
        });
      }
    };
    
    loadUser();
  }, []);

  // Sign up function
  const signUp = async (data: SignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Registration failed');
      }
      
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account',
        variant: 'default'
      });
      
      // Clear the state after successful registration
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Login function
  const login = async (data: LoginData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Login failed');
      }
      
      // Save token to local storage
      localStorage.setItem('token', result.token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: result.user
      });
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${result.user.firstName}!`,
        variant: 'default'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Login Failed',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
      variant: 'default'
    });
  };

  // Verify email function
  const verifyEmail = async (email: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Email verification failed');
      }
      
      dispatch({ type: 'LOGOUT' });
      
      toast({
        title: 'Email Verified',
        description: 'Your email has been verified successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed';
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Verification Failed',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signUp,
        login,
        logout,
        verifyEmail,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Auth context hook
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
