import React, { useState, useRef, useCallback, useEffect} from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import { debounce } from 'lodash'


import { Form } from '@unform/mobile'
import Input from '../input'
import Loading from '../loading'

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
  setValue,
  togleModal,
  inputPlaceHolder,
  icon,
  newPlaceHolder,
  getDataFunction,
  setLoading,
  loading
}) => {
  const newFormRef = useRef(null);
  const searchRef = useRef(null);
  const addNewRef = useRef(null);

  const [data, setData] = useState([])

  const [newField, setNewField] = useState(false);
  const [newFieldValue, setNewFieldValue] = useState('')
  const [page, setPage] = useState(1);
  const [name, setName] = useState('')
  const [ended, setEnded] = useState(false);

  const handler = useCallback(debounce(getData, 1000), []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const responseData = await getDataFunction(1, name)
        setPage(page + 1)

        if(responseData.length === 0) {
          setEnded(true)
        }
        console.log(responseData)

        setData(responseData)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
    loadData()
  }, [])

  const loadDataPagination = useCallback(async () => {
    console.log('load data')
    if(loading || ended){
      return;
    }
    setLoading(true)
    try {
      const responseData = await getDataFunction(page +1 , name)
      console.log(responseData)
      console.log(loading, ended)
      setPage(page + 1)

      if (responseData.length === 0) {
        setEnded(true)
        setLoading(false)
        return;
      }

      const newData = data.concat(responseData)
      setData(newData)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  } , [])

  async function getData(value) {
    setEnded(false)
    setLoading(true)
    try {
      setName(value)
      setPage(1)
      const responseData = await getDataFunction(1, value)

      if(!responseData && responseData.length < 20) {
        setEnded(true)
      }
      setLoading(false)
      setData(responseData)
    } catch(err) {
      setLoading(false)
    }
  }




  return (
    <Modal
      backdropOpacity={0.2}
      onBackdropPress={() => togleModal()}
      isVisible={isVisible}
    >
      <ModalView>
          <ModalHeader>
            {(!newField && !!newPlaceHolder) && (
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
              <Form>
                <Input
                  name="search"
                  icon="search"
                  placeholder={inputPlaceHolder}
                  returnKeyType="send"
                  onChangeText={handler}
                />
              </Form>
            </SearchInput>
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.name}${index}`}
            onEndReached={loadDataPagination}
            onEndReachedThreshold={0.3}
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
