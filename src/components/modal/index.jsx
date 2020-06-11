import React, { useState, useRef, useCallback} from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

import { Form } from '@unform/mobile'
import Input from '../input'

import {
  ModalView,
  ModalItens,
  ItemText,
  SearchInput,
  BackButton,
  ModalHeader,
  AddButton,
  NewValueInput,
  AddNewValueButton,
  ButtonText,
  BackToList
} from './styles';

const modal = ({
  isVisible,
  data,
  setSearchValue,
  setValue,
  togleModal,
  inputPlaceHolder,
  icon,
  newPlaceHolder,
}) => {
  const newFormRef = useRef(null);
  const searchRef = useRef(null);
  const addNewRef = useRef(null);



  const [newField, setNewField] = useState(false);
  const [newFieldValue, setNewFieldValue] = useState('')

  return (
    <Modal
      backdropOpacity={0.2}
      onBackdropPress={() => togleModal()}
      isVisible={isVisible}
    >
      <ModalView>
          <ModalHeader>
            {!newField && (
              <AddButton onPress={() => setNewField(true)}>
                <Feather name="plus" size={35} color="#fff" />
              </AddButton>
            )}

            {newField && (
              <BackToList onPress={() => setNewField(false)} >
                <Feather name="arrow-left" size={35} color="#fff" />
              </BackToList>
            )}
            <BackButton onPress={() => togleModal()} >
              <Feather name="x" size={35} color="#fff" />
            </BackButton>
          </ModalHeader>
          {!newField && (
          <>
            <SearchInput>
              <Form >
                <Input
                  name="search"
                  icon="search"
                  placeholder={inputPlaceHolder}
                  returnKeyType="send"
                  onChangeText={(value) => setSearchValue(value)}
                />
              </Form>
            </SearchInput>
          <FlatList
            data={data}
            key={item => item.name}
            renderItem={({item}) => (
              <ModalItens onPress={() => {
                setValue(item.name)
                togleModal()
                }}>
                <ItemText> {item.name}</ItemText>
              </ModalItens>
            )}
          />
        </>
        )}
        {newField && (
          <NewValueInput>
            <>
              <Form ref={newFormRef}>
                <Input
                  ref={addNewRef}
                  name="newValue"
                  icon={icon}
                  placeholder={newPlaceHolder}
                  returnKeyType="send"
                  value={newFieldValue}
                  onChangeText={(value) => {
                    setNewFieldValue(value)
                  }}
                />
              </Form>
              <AddNewValueButton onPress={() => {
                setValue(newFieldValue)
                togleModal()
              }}>
                  <ButtonText>Adicionar</ButtonText>
              </AddNewValueButton>
            </>

          </NewValueInput>
        )}

      </ModalView>
    </Modal>
  )
}

export default modal;
