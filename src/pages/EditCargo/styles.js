import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  /* font-family: 'RobotoSlab-Medium'; */
  margin: 64px 0 24px;
`;

export const Restrictions = styled.Text`
  font-size: 20px;
  padding: 16px 0px;
  color: #f4ede8;

`;

export const BackToProfile = styled.TouchableOpacity`
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

export const BackToProfileText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  /* font-family: 'RobotoSlab-Regular'; */
  margin-left: 16px;
`;