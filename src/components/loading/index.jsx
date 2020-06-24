import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';

import { Container } from './styles';

const loading = ({isVisible}) => {
  return (

    <Modal
      transparent={true}
      animationType={'none'}
      visible={isVisible}
    >
      <Container>
        <ActivityIndicator animating={isVisible} size="large" color="#FA0" />
      </Container>
    </Modal>

  );
}


export default loading;
