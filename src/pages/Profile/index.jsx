import React from 'react';
import {Alert} from 'react-native';
import { Container, Exit, Title } from './styles';

import Button from '../../components/button';
import { useAuth } from '../../hooks/auth';

import LineHeader from '../../components/lineHeader';

import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const { signOut } = useAuth();

  const { navigate } = useNavigation();

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
      <Title>
        Perfil
      </Title>
      <LineHeader />
      <Button style={{width: '100%', backgroundColor: '#2d2d39', alignItems: 'flex-start', paddingLeft: 30}} onPress={() => navigate('EditUserData')}>Alterar dados</Button>
      <Button style={{width: '100%', backgroundColor: '#2d2d39', alignItems: 'flex-start', paddingLeft: 30}} onPress={() => {}}>Alterar Endereço</Button>
      <Button style={{width: '100%', backgroundColor: '#2d2d39', alignItems: 'flex-start', paddingLeft: 30}} onPress={() => {}}>Alterar Cargo </Button>
      <Exit>
        <Button style={{backgroundColor: '#2d2d39'}} onPress={() => handleSignOut()}>Sair da Conta</Button>
      </Exit>
    </Container>
  );

};

export default Profile;
