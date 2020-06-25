import React from 'react';
import { Container, Exit } from './styles';

import Button from '../../components/button';
import { useAuth } from '../../hooks/auth';

const Profile = () => {
  const { signOut, user } = useAuth();
  return (
    <Container>
      <Exit>
        <Button onPress={() => signOut()}>Sair da Conta</Button>
      </Exit>
    </Container>
  );

};

export default Profile;
