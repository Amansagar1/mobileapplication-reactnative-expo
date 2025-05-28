import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({
  isLoggedIn: false,
  isAuthResolved: false,
  setIsLoggedIn: () => {},
  token: null,
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [token, setToken] = useState(null);

  // Check for existing token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        
        if (storedToken) {
          // Validate token if needed (optional)
          // You can add token validation logic here
          setToken(storedToken);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setIsAuthResolved(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Update token when login status changes
  useEffect(() => {
    if (!isLoggedIn) {
      setToken(null);
    }
  }, [isLoggedIn]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    isLoggedIn,
    isAuthResolved,
    token,
    setIsLoggedIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};