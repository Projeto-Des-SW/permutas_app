import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  background-color: #31303d;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #ffffff;
  /* font-family: 'RobotoSlab-Medium'; */
  margin: 40px 0 24px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
`;

export const SubTitle = styled.Text`
  color: #ffffff;
  font-size: 30px;
  text-align: center;

  /* font-family: 'RobotoSlab-Regular'; */
`;
