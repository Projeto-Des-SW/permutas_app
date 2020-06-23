import React from 'react';

import {
  View,
} from 'react-native';

import { Container } from './styles';

import Button from '../../components/button';
import { useAuth } from '../../hooks/auth';

const Settings = () => {
  const { signOut, user } = useAuth();
  return (
    <Container>           
      <View style={{ width: '100%', marginTop: 30 }}>
        <Button onPress={() => signOut()}>Sair da Conta</Button>
      </View>
    </Container>
  );

};

export default Settings;
