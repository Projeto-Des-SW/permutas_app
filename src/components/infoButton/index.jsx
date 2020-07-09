import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Container, CreateAccountButtonText } from './styles';

const infoButton = ({children, onPress}) => {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
      <CreateAccountButtonText>
        {children}
      </CreateAccountButtonText>
      </TouchableOpacity>
    </Container>
  )
}

export default infoButton;
