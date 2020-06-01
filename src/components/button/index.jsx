import React from 'react';

import { Container, ButtonText } from './styles';

const button = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
};

export default button;
