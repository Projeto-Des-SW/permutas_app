import styled from 'styled-components/native';

import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: 100%;
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
  font-size: 18px;
  font-weight:bold;
`;
