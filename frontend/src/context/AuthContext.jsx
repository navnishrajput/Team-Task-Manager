import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, signupUser } from '../api/authApi';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const setUserData = (data) => {
    const token = data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const userObj = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role
    };
    
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    setUserData(data);
    return data;
  };

  const signup = async (userData) => {
    const { data } = await signupUser(userData);
    setUserData(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout, isAdmin, isAuthenticated, loading, setUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};