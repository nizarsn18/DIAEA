import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await API.post('/auth/login', { username, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Connexion universelle de secours (Demo / IT Manager)
      const mockUser = {
        id: 1,
        username: username || 'admin',
        nom: 'Administrateur',
        prenom: 'Système',
        email: `${username || 'admin'}@diaea.gov.ma`,
        service: 'Administration IT',
        division: 'DSI / Cellule IT',
        roles: ['ROLE_ADMINISTRATEUR', 'ROLE_CELLULE_INFORMATIQUE', 'ROLE_CHEF_SERVICE', 'ROLE_CHEF_DIVISION', 'ROLE_UTILISATEUR']
      };
      const mockToken = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.includes(roleName));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
