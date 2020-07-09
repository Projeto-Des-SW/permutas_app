import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

export const Title = styled.Text`
  font-size: 18px;
  color: #fff;
  margin: 10px 0 25px;
  text-align: center;
`;

export const BackToSign = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #1c1d29;
  border-top-width: 1px;
  border-color: #000;
  padding: 16px 0;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const BackToSignText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  /* font-family: 'RobotoSlab-Regular'; */
  margin-left: 16px;
`;
