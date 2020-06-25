import React from 'react';
import {Alert} from 'react-native';
import { Container, Exit } from './styles';

import Button from '../../components/button';
import { useAuth } from '../../hooks/auth';

const Profile = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = () => {
    try {
      Alert.alert(
        'Logout',
        `Tem certeza que quer sair da sua conta?`,
        [
          {
            text: 'Cancelar',
            onPress: () => { return; },
            style: 'cancel',
          },
          {
            text: 'Sair',
            onPress: () => signOut(),
            style: 'destructive'
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Exit>
        <Button onPress={() => handleSignOut()}>Sair da Conta</Button>
      </Exit>
    </Container>
  );

};

export default Profile;
