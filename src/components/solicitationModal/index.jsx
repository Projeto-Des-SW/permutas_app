import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import * as S from './styles';
import {
  ModalView,
  ModalHeader,
  HeaderContent,
  ItemTitle,
  ItemText,
  TextCenter,
  Button,
  ButtonText
} from './styles';

import { REACT_APP_API_URL, REACT_APP_AVATAR_URL } from '@env';

const modal = ({
  item,
  isVisible,
  toggleModal,
  createSolicitation,
}) => {

  return (
    <Modal
      backdropOpacity={0.8}
      backdropColor='#1C1D29'
      onBackdropPress={toggleModal}
      isVisible={isVisible}
    >
      {item && item.governmentEmployee && item.institution ?
        <ModalView>
          <ModalHeader>
          {item.governmentEmployee.user.avatar ? (
          <S.AvatarImg
            source={{
              uri: `${REACT_APP_API_URL}/${REACT_APP_AVATAR_URL}/${item.governmentEmployee.user.avatar}`,
            }}
          />
          ) : (
            <FontAwesome name={'user-circle'} size={130} color="white" />
          )}
            <HeaderContent>
              <ItemTitle>{item.governmentEmployee.user.name}</ItemTitle>
              <ItemText>{item.institution.name}</ItemText>
              <ItemText>{item.governmentEmployee.position.name}</ItemText>
              <ItemText>{item.governmentEmployee.position.description}</ItemText>
            </HeaderContent>
          </ModalHeader>
          <TextCenter>
            De: {item.governmentEmployee.institutionAddress.city}/{item.governmentEmployee.institutionAddress.state} - Para: {item.destinationAddress.city}/{item.destinationAddress.state}
          </TextCenter>
          <View style={{
            width: '100%',
            marginTop: 20,
            borderBottomColor: '#acacac',
            borderBottomWidth: 1
          }} />
          <TextCenter>Você deseja enviar uma solicitação de permuta para essa pessoa?</TextCenter>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: 25
          }}>
            <Button
              style={{
                backgroundColor: 'red'
              }}
              onPress={() => toggleModal()}
            >
              <ButtonText>Não</ButtonText>
            </Button>
            <Button
              style={{
                backgroundColor: 'green'
              }}
              onPress={() => createSolicitation(item.id)}
            >
              <ButtonText>Sim</ButtonText>
          </Button>
          </View>
        </ModalView>
        : <View></View>}
    </Modal>
  )
}

export default modal;
