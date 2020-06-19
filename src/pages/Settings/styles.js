import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
  background-color: #1c1d29;
`;
