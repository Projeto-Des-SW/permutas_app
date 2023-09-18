import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 30px ${Platform.OS === 'android' ? 60 : 40}px;
  background-color: #31303d;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin: 30px 8px 15px;
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
  margin-top: 64px;
`;

export const TextCard = styled.Text`
  font-size: 18px;
  color: #fff;
`;

export const InterestsList = styled(FlatList)`
  margin-top: 30px;
  width: 100%;
`;

export const InterestCard = styled.View`
  height: 90px;
  flex-direction: row;
  background-color: #25242e;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const ContentInterest = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
`;

export const TitleInterest = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const TextInterest = styled.Text`
  font-size: 14px;
  color: #fff;
`;

export const DateInterest = styled.Text`
  font-size: 10px;
  color: #acacac;
  align-self: flex-end;
`;

export const MessageView = styled.View`
  height: 100px;
  width: 100%;
  background-color: #25242e;
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
`;

export const MessageText = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

export const ListContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const HeaderButtons = styled.View`
  width: 100%;
  margin-top: 8px;
  flex-direction: row;
  justify-content: space-around;
`;

export const SolicitationCard = styled.TouchableOpacity`
  height: 120px;
  flex-direction: row;
  background-color: #25242e;
  border-radius: 15px;
  padding: 12px;
  margin-bottom: 10px;
  align-items: center;
`;

export const ContentSolicitation = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 15px;
`;

export const TitleSolicitation = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #fff;
`;

export const TextSolicitation = styled.Text`
  font-size: 13px;
  color: #fff;
`;

export const AvatarImg = styled.Image`
  width: 70px;
  height: 72px;
  border-radius: 100px;
`;

