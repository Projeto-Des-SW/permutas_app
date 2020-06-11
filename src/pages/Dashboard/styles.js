import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
  background-color: #7c60f7;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #efefef;
  margin: 64px 0 24px;
`;

export const Card = styled.View`
  width: 100%;
  height: 100px;
  background-color: #efefef;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
`;

export const TextCard = styled.Text`
  font-size: 18px;
`;

export const MatchsList = styled(FlatList)`
  margin-top: 30px;
  width: 100%;
`;

export const MatchCard = styled.View`
  flex-direction: row;
  background-color: #efefef;
  border-radius: 15px;
  padding: 12px;
  margin-bottom: 10px;
`;

export const TextMatch = styled.Text`
  margin-left: 15px;
  font-size: 16px;
`;
