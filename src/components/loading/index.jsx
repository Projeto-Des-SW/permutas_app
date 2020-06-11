import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Container } from './styles';

const loading = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color="#FA0" />
    </Container>
  );
}


export default loading;
