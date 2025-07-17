import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const AuthContext = createContext();

// Default users for demo purposes
const defaultUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@hitech.com',
    name: 'System Administrator',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    lastLogin: null
  },
  {
    id: '2',
    username: 'operator',
    password: 'operator123',
    email: 'operator@hitech.com',
    name: 'System Operator',
    role: 'operator',
    status: 'active',
    createdAt: new Date(),
    lastLogin: null
  }
];

// Role permissions configuration
const rolePermissions = {
  admin: {
    dashboard: { read: true, write: true },
    inventory: { read: true, write: true },
    sales: { read: true, write: true },
    service: { read: true, write: true },
    customers: { read: true, write: true },
    suppliers: { read: true, write: true },
    courses: { read: true, write: true },
    invoices: { read: true, write: true },
    reports: { read: true, write: true },
    settings: { read: true, write: true },
    users: { read: true, write: true }
  },
  operator: {
    dashboard: { read: true, write: false },
    inventory: { read: true, write: true },
    sales: { read: true, write: true },
    service: { read: true, write: true },
    customers: { read: true, write: true },
    suppliers: { read: true, write: false },
    courses: { read: true, write: true },
    invoices: { read: true, write: false },
    reports: { read: true, write: false },
    settings: { read: false, write: false },
    users: { read: false, write: false }
  }
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('users', defaultUsers);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (currentUser) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [currentUser]);

  const login = async (username, password) => {
    try {
      const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.status === 'active'
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: new Date() };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (module, action = 'read') => {
    if (!currentUser || !currentUser.role) return false;
    
    const permissions = rolePermissions[currentUser.role];
    if (!permissions || !permissions[module]) return false;
    
    return permissions[module][action] === true;
  };

  const canAccess = (module) => {
    return hasPermission(module, 'read');
  };

  const canModify = (module) => {
    return hasPermission(module, 'write');
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      lastLogin: null
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id, userData) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id) => {
    if (currentUser && currentUser.id === id) {
      throw new Error('Cannot delete currently logged in user');
    }
    setUsers(users.filter(user => user.id !== id));
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    if (currentUser.password !== oldPassword) {
      throw new Error('Current password is incorrect');
    }

    const updatedUser = { ...currentUser, password: newPassword };
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    users,
    login,
    logout,
    hasPermission,
    canAccess,
    canModify,
    addUser,
    updateUser,
    deleteUser,
    changePassword,
    rolePermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
