import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native';

import { debounce } from 'lodash'
import { Form } from '@unform/mobile';

import api from '../../services/api'


import Input from '../../components/input'
import Loading from '../../components/loading';
import InfoButton from '../../components/infoButton'

import logo from '../../../assets/logo.png'


import {
  Container,
  InstitutionButton,
  InstitutionContainer,
  Header,
  InstitutionButtonText,
  List,
  Title,
  Terms,
  SearchContainer
} from './styles';

const ListInstitutions = () => {
  const [page, setPage] = useState(1);
  const [institutions, setInstitutions] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [ended, setEnded] = useState(false);

  const navigation = useNavigation()

  // const { signOut } = useAuth()
  // signOut()

  const searchInput = useRef()

  useEffect(() => {
    async function loadInstitutions() {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('@Permutas:token')
        const response = await api.get(`/institution?page=${page +1 }&name=${name}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPage(page + 1)

        const data = response.data;
        if(data.length === 0) {
          setEnded(true)
        }
        console.log(data)

        setInstitutions(data)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
    loadInstitutions()
  },[])



  async function loadInstitutionsPagination() {
    if(loading || ended){
      return;
    }
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      const response = await api.get(`/institution?page=${page + 1}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPage(page + 1)
      const data = response.data;

      if (data.length === 0) {
        setEnded(true)
      }

      const newinstitutions = institutions.concat(data)
      setInstitutions(newinstitutions)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }


  const handler = useCallback(debounce(getInstitutions, 1000), []);

  async function getInstitutions (value) {
    setEnded(false)
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      setName(value)
      setPage(1)
      const response = await api.get(`/institution?name=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      if(!data && data.length === 0) {
        setEnded(true)
      }
      setLoading(false)
      setInstitutions(response.data)
    } catch(err) {
      setLoading(false)
    }
  }

  const handlerAddressRegister = useCallback((id) => {
    navigation.navigate('AddressRegister', {
      institutionId: id
    });
  },[])

  const renderItem = useCallback(({item}) => {
      return (
        <InstitutionContainer>
          <InstitutionButton onPress={() => handlerAddressRegister(item.id)}>
            <InstitutionButtonText>
              {item.name}
            </InstitutionButtonText>
          </InstitutionButton>
        </InstitutionContainer>
      )
    }, []);
  return (
    <Container>
      <Loading isVisible={loading}/>
      <Image source={logo} style={{width: 150, height:150}} />
      <View>
        <Title>Selecione o orgão.</Title>
      </View>
      <SearchContainer>
        <Form>
          <Input
            ref={searchInput}
            name="search"
            icon="search"
            placeholder="Pesquisar orgão"
            returnKeyType="send"
            onChangeText={handler}
          />
        </Form>
      </SearchContainer>
      <List>
        <FlatList
          data={institutions}
          keyExtractor={item => item.id}
          onEndReached={loadInstitutionsPagination}
          onEndReachedThreshold={0.3}
          renderItem={renderItem}
        />
      </List>
      <Terms>
        <InfoButton onPress={() => console.log('alo')}>
          Termos de uso
        </InfoButton>
      </Terms>
    </Container>
  )
}

export default ListInstitutions;
