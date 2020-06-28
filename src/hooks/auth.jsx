import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedDate() {
      const [token, user] = await AsyncStorage.multiGet([
        '@Permutas:token',
        '@Permutas:user',
      ]);
      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }
    loadStoragedDate();
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Permutas:token', '@Permutas:user']);

    setData({});
  }, []);

  const singIn = useCallback(async ({ email, password }) => {
    const response = await api.post('session', {
      email,
      password,
    });

    const { token, user } = response.data;
    await AsyncStorage.multiSet([
      ['@Permutas:token', token],
      ['@Permutas:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signUp = useCallback(async (session) => {
    console.log('chegou aquii')
    const { token, user } = session;
    await AsyncStorage.multiSet([
      ['@Permutas:token', token],
      ['@Permutas:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, singIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
