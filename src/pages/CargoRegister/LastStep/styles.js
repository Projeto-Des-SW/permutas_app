import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  /* align-items: center; */
  justify-content: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  margin: 64px 0 30px;
  font-weight: bold;
  text-align: center;
`;

export const InfosText = styled.Text`
  margin-top: 10px;
  color: #f4ede8;
  font-size: 16px;
`;

export const LinkText = styled.Text`
  margin-top: 30px;
  color: #f4ede8;
  text-align: center;
  font-size: 14px;
  text-decoration: underline;
`;
