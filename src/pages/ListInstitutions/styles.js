import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  /* justify-content: center; */
  background-color: #2d2d39;
  padding: 0 0 ${Platform.OS === 'android' ? 100 : 0}px;
`;

export const Header = styled.View`
  height: 100px;
  background-color: #1c1d29;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  padding-top: 20px;
`;
export const InstitutionButtonText = styled.Text`
  font-size: 16px;
  color: #000;

`

export const InstitutionButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px 16px;

`;

export const  InstitutionContainer = styled.View`
  background: #e32245;
  border-radius: 30px;
  margin: 8px;
  height: 80px;
`;

