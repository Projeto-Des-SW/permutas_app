import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
  background-color: #1c1d29;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #efefef;
  margin: 64px 0 24px;
`;

export const Card = styled.View`
  width: 100%;
  height: 80px;
  background-color: #2d2d39;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
`;

export const TextCard = styled.Text`
  font-size: 18px;
  color: #fff;
`;

export const MatchsList = styled(FlatList)`
  margin-top: 30px;
  width: 100%;
`;

export const MatchCard = styled.View`
  height: 100px;
  flex-direction: row;
  background-color: #efefef;
  border-radius: 15px;
  padding: 12px;
  margin-bottom: 10px;
  align-items: center;
`;

export const ContentMatch = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 15px;
`;

export const TitleMatch = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const TextMatch = styled.Text`
  font-size: 16px;
`;

export const MessageView = styled.View`
  margin-top: 50px;
`;

export const MessageText = styled.Text`
  color: #efefef;
  font-size: 22px;
`;
