import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useWeb3 } from './Web3Context';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { account } = useWeb3();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Получить или создать пользователя при подключении кошелька
  useEffect(() => {
    if (account) {
      authenticateUser(account);
    } else {
      setUser(null);
    }
  }, [account]);

  const authenticateUser = async (walletAddress) => {
    try {
      setLoading(true);
      
      // Проверяем, есть ли сохранённая роль
      const savedRole = localStorage.getItem(`user_role_${walletAddress}`);
      
      if (savedRole) {
        const response = await axios.post('/api/users/auth', {
          walletAddress,
          role: savedRole,
        });
        setUser(response.data.user);
      } else {
        // Если роль не сохранена, пользователю нужно выбрать роль
        setUser({ walletAddress, needsRole: true });
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = async (role) => {
    if (!account) return;

    try {
      setLoading(true);
      const response = await axios.post('/api/users/auth', {
        walletAddress: account,
        role,
      });
      
      setUser(response.data.user);
      localStorage.setItem(`user_role_${account}`, role);
    } catch (error) {
      console.error('Error selecting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user || !account) return;

    try {
      const response = await axios.put('/api/users/profile', {
        walletAddress: account,
        ...profileData,
      });
      
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    selectRole,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

