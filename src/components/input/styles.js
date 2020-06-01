import styled, { css } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';



export const Container = styled.View`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #a5a3e6;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #a5a3e6;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      border-color: #f3dc5d;
    `}


  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #000;
  font-size: 16px;
  /* font-family: 'RobotoSlab-Regular'; */
`;

export const Icon = styled(Feather)`
  margin-right: 16px;
`;
