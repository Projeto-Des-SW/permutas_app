import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

import { Container, Icon, ButtonText, ButtonPlaceholder } from './styles';


const Input = (
  {children, name, icon, filled, value, placeholder,  ...rest },
  ref,
) => {
  const buttonElementRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      buttonElementRef.current.focus();
    },
  }));


  return (
    <Container isFocused={!!value} {...rest}>
      <Icon
        name={icon}
        size={20}
        color={value ? '#000' : '#666360'}
      />
      {value ? (
      <ButtonText>
        {value}
      </ButtonText>):
      <ButtonPlaceholder>
        {placeholder}
      </ButtonPlaceholder>
      }

    </Container>
  );
};

export default forwardRef(Input);
