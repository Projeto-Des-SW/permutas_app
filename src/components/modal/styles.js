import styled, { css } from 'styled-components/native';

export const ModalView = styled.View`
  flex: 0.8;
  border-radius: 25px;
  background-color: #0c1221;
`;

export const ModalItens = styled.TouchableOpacity`
  height: 60px;
  align-items: center;
  justify-content: center;
  background-color: #282c36;

  margin: 0 15px;
  margin-bottom: 15px;
  border-radius: 10px;
`;

export const ItemText = styled.Text`
  color: #fff;
  font-size: 16px;
`

export const SearchInput = styled.View`
  padding: 15px;
  padding-top: 10px;
`
export const BackButton = styled.TouchableOpacity`
  margin-left: 10px;
  margin-top: 10px;
  height: 35px;
  width: 40px;
`

export const BackToList = styled.TouchableOpacity`
margin-left: 10px;
margin-top: 10px;
height: 35px;
width: 40px;
`

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const AddButton = styled.TouchableOpacity`
margin-left: 10px;
margin-top: 10px;
height: 35px;
width: 40px;
`

export const NewValueInput = styled.View`
  flex: 0.6;
  justify-content: center;
  padding: 15px;

`;

export const AddNewValueButton = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background: #f3dc5d;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #312e38;
  font-size: 18px;
`;

