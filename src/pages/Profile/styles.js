import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  padding: 0 30px 20px;
  background-color: #1c1d29;
`;

export const Exit = styled.View`
  flex: 1;
  width: 100%;
  justify-content: flex-end
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #efefef;
  margin: 50px 8px 15px;
  align-self: flex-start;
`;

export const Restrictions = styled.Text`
  font-size: 20px;
  padding: 16px 0px;
  color: #f4ede8;

`;
