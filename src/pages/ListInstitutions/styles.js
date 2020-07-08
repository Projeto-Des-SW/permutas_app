import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  /* justify-content: center; */
  background-color: #1c1d29;
`;

export const InstitutionButtonText = styled.Text`
  font-size: 14px;
  color: #fff;
  text-align: center;
`
export const SearchContainer = styled.View`
  width: 100%;
  padding: 0 30px;
`

export const InstitutionButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px 0px;
`;

export const  InstitutionContainer = styled.View`
  background: #2D2D39;
  border-radius: 10px;
  margin: 5px 30px;
  min-height: 80px;
  padding: 0 10px;
`;

export const List = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 18px;
  color: #fff;
  margin: 10px 0 25px;
  text-align: center;
`;

export const Terms = styled.View`
  width: 70%;
  margin-bottom: 10px;
`
