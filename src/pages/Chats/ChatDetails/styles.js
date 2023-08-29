import styled from 'styled-components/native';
import { FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 20px;
  background-color: #25242e;
`;

export const Text = styled.Text`
  font-size: 14px;
  color: #fff;
`;

export const Header = styled.View`
  width: 100%;
  margin: 20px 8px 15px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #efefef;
`;

export const ChatContainer = styled.View`
  width: 100%;
  height: 83%;
  border-radius: 10px;
  padding: 10px;
  background-color: #31303d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const MessageList = styled(FlatList)`
  width: 100%;
`;

export const MessageContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: ${({ sender }) => (sender ? 'row-reverse' : 'row')};
  column-gap: 10px;
  align-items: flex-start;
`;
export const MessageTextContainer = styled.View`
  width: 80%;
  border-radius: 10px;
  background-color: #63617a;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: ${({ sender }) =>
    sender ? '10px 0 10px 10px' : '0px 10px 10px 10px'};
`;

export const MessageDate = styled.View`
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: #c4bff2;
`;

export const MessageText = styled.Text`
  font-size: 15px;
  color: #fff;
`;

export const InputContainer = styled.View`
  width: 80%;
  margin-bottom: -8px;
`;

export const InputBtnContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-top: 10px;
`;

export const SendBtn = styled.TouchableOpacity`
  background-color: #63617a;
  border-radius: 50px;
  padding: 10px;
  margin-left: 10px;
  align-items: center;
`;

export const EmptyContentView = styled.View`
  height: 100px;
  width: 100%;
  background-color: #2d2d39;
  border-radius: 8px;
  padding: 20px;
  justify-content: center;
`;

export const EmptyContentText = styled.Text`
  color: #efefef;
  font-size: 18px;
  text-align: center;
`;

export const AvatarImg = styled.Image`
  width: 35px;
  height: 36px;
  border-radius: 100px;
`;

export const BackToChat = styled.TouchableOpacity`
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

export const BackToChatText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  margin-left: 16px;
`;