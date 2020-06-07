import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/auth';
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Title, Buttons } from './styles';
import { View } from 'react-native';
import Button from '../../../components/button';

import api from '../../../services/api';

const FirstStep = () => {
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const handleVisitor = async () => {
    try {
      user.isGovernmentEmployee = false;
      const token = await AsyncStorage.getItem('@Permutas:token');

      await api.put('users', user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const handleServer = async () => {
    try {
      user.isGovernmentEmployee = true;
      const token = await AsyncStorage.getItem('@Permutas:token');

      await api.put('users', user , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigation.navigate('ListInstitutions');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <View>
        <Title onPress={() => signOut()}>Bem-Vindo</Title>
      </View>
      <Buttons>
        <Button onPress={() => handleServer()}>Sou Servidor</Button>
        <Button onPress={() => handleVisitor()}>Sou Visitante</Button>
      </Buttons>
    </Container>
  );
};

export default FirstStep;
