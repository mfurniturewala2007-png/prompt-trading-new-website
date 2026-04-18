import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('pt_registered');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('pt_registered');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const data = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone_number || userData.phone,
      registeredAt: userData.created_at || new Date().toISOString()
    };
    setUser(data);
    localStorage.setItem('pt_registered', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pt_registered');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isRegistered: !!user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
