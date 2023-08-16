import styled from 'styled-components/native';

export const ModalView = styled.View`
  flex: 0.2;
  border-width: 0.5px;
  border-color: #acacac;
  border-radius: 25px;
  background-color: #2D2D39;
  align-items: center;
  justify-content: center;
  padding: 25px 20px;
`;

export const Text = styled.Text``


export const Button = styled.TouchableOpacity`
  height: 50px;
  width: 70%;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
  background-color: #63617a;
  border: solid 2px #1c1d29;
`;

export const ButtonText = styled.Text`
  /* font-family: 'RobotoSlab-Medium'; */
  color: #ffffff;
  font-size: 18px;
  font-weight:bold;
`;
