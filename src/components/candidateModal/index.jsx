import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';

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


const modal = ({
  item,
  isVisible,
  toggleModal,
  confirmSolicitation,
  declineSolicitation,
}) => {

  return (
    <Modal
      backdropOpacity={0.8}
      backdropColor='#1C1D29'
      onBackdropPress={toggleModal}
      isVisible={isVisible}
    >
      {item && item.user && item.institution && item.position ?
        <ModalView>
          <View style={{ width: '100%', marginBottom: 15 }}>
            <FontAwesome
              name='arrow-left'
              size={30}
              color='white'
              onPress={toggleModal}
            />
          </View>
          <ModalHeader>
            <FontAwesome
              name={'user-circle'}
              size={130}
              color='white'
            />
            <HeaderContent>
              <ItemTitle>{item.user.name}</ItemTitle>
              <ItemText>{item.institution.name}</ItemText>
              <ItemText>{item.position.name}</ItemText>
              <ItemText>{item.position.description}</ItemText>
            </HeaderContent>
          </ModalHeader>
          <TextCenter>
            De: {item.institutionAddress.city}/{item.institutionAddress.state}
          </TextCenter>
          <View style={{
            width: '100%',
            marginTop: 20,
            borderBottomColor: '#acacac',
            borderBottomWidth: 1
          }} />
          <TextCenter>Você deseja permutar com essa pessoa?</TextCenter>
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
              onPress={() => declineSolicitation(item.id)}
            >
              <ButtonText>Recusar</ButtonText>
            </Button>
            <Button
              style={{
                backgroundColor: 'green'
              }}
              onPress={() => confirmSolicitation(item.id)}
            >
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </View>
        </ModalView>
        : <View></View>}
    </Modal>
  )
}

export default modal;
