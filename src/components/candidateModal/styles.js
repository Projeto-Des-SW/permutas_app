import styled, { css } from 'styled-components/native';

export const ModalView = styled.View`
  flex: 0.5;
  border-width: 0.5px;
  border-color: #acacac;
  border-radius: 25px;
  background-color: #2D2D39;
  align-items: center;
  padding: 25px 20px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;

export const HeaderContent = styled.View`
  width: 50%;
  margin-top: 10px;
`;

export const ItemTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export const ItemText = styled.Text`
  color: #fff;
  font-size: 16px;
`

export const TextCenter = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`

export const Button = styled.TouchableOpacity`
  height: 50px;
  width: 45%;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  /* font-family: 'RobotoSlab-Medium'; */
  color: #ffffff;
  font-size: 18px;
  font-weight:bold;
`;

export const AvatarImg = styled.Image`
  width: 70px;
  height: 72px;
  border-radius: 100px;
`;