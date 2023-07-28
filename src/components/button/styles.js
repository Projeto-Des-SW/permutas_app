import styled from 'styled-components/native';

import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  height: 60px;
  background: #e32245;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  /* font-family: 'RobotoSlab-Medium'; */
  color: #ffffff;
  font-weight:bold;
`;
