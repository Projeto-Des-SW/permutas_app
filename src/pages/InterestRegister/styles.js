import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #1c1d29;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
`;


export const Title = styled.Text`
  font-size: 24px;
  color: #efefef;
  font-weight: bold;
  margin: 50px 0;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: #efefef;
  align-self: flex-start;
  font-weight: bold;
  margin: 10px 0 15px 0;
`;
