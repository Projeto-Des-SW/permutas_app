import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/auth';

import { Container, Title, Buttons } from './styles';
import { View } from 'react-native';
import Button from '../../../components/button';

const FirstStep = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const handleVisitor = () => {
    navigation.navigate('Dashboard');
  };

  const handleServer = () => {
    // criar logica do servidor
    // navigation.navigate('SecondStep');
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
