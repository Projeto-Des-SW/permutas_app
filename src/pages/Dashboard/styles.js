import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  padding: 0 30px ${Platform.OS === 'android' ? 60 : 40}px;
  background-color: #1c1d29;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #efefef;
  margin: 50px 8px 15px;
  align-self: flex-start;
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
  background-color: #2D2D39;
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
  color: #fff;
`;

export const TextMatch = styled.Text`
  font-size: 16px;
  color: #fff;
`;

export const MessageView = styled.View`
  height: 100px;
  width: 100%;
  background-color: #2D2D39;
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
`;

export const MessageText = styled.Text`
  color: #efefef;
  font-size: 18px;
  text-align: center;
`;

export const ListContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`
