import styled from 'styled-components/native'
import ReactNativeModal from 'react-native-modal';

import { Dimensions } from 'react-native'

const deviceHeight = Dimensions.get("window").height



export const ModalView = styled.ScrollView`
  flex: 1;
  border-radius: 10px;
  background-color: #fff;
  margin: 0;
`;

export const Modal = styled(ReactNativeModal)`
  margin: 0;
  margin-top: ${deviceHeight * 0.2}px;
`;

export const ModalHeader = styled.View`
  width: 100%;
  background-color: #2d2d39;
  padding: 10px 10px;
  flex-direction: row;
  justify-content: space-between;
`

export const HeaderText = styled.Text`
  margin-left: 20px;
  margin-top: 3px;
  color: #fff;
  font-size: 22px;
`

export const ClearAllFilter = styled.Text`
  margin-top: 6px;
  color: #fff;
  font-size: 15px;
`;

export const Exit = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const FilterBlock = styled.View`
  margin: 10px 10px 0 10px;
  min-height: 60px;
  border-bottom-width: 2px;
  border-bottom-color: #ddd;
`;

export const FilterBlockTittle = styled.Text`
  font-size: 20px;
`

export const FilterBlockBody = styled.View`
  padding-top: 10px;
  width: 100%;
`;

export const FilterBlockHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ClearFilter = styled.Text``;


export const ApplyFilterButton = styled.TouchableOpacity`
  flex: 1;
  height: 60px;
  margin: 50px 30px 0 30px;
  border-radius: 15px;
  background-color: #30A887;
  justify-content: center;
  align-items: center;
`;

export const ApllyFilterText = styled.Text`
  font-size: 18px;
  color: #fff;
`;
