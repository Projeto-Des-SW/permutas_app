import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px;
  background-color: #1c1d29;
`;

export const Header = styled.View`
  width: 100%;
  margin: 30px 8px 0px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #efefef;
`;

export const ChatCard = styled.TouchableOpacity`
  height: 90px;
  flex-direction: row;
  background-color: #2D2D39;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const ContentCard = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
`;

export const TitleCard = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const TextCard = styled.Text`
  font-size: 14px;
  color: #fff;
`;

export const DateContainer = styled.Text`
  font-size: 10px;
  color: #acacac;
  align-self: flex-end;
`;

export const ChatList = styled(FlatList)`
  margin-top: 30px;
  width: 100%;
`;

export const EmptyContentView = styled.View`
  height: 100px;
  width: 100%;
  background-color: #2D2D39;
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
`;

export const EmptyContentText = styled.Text`
  color: #efefef;
  font-size: 18px;
  text-align: center;
`;