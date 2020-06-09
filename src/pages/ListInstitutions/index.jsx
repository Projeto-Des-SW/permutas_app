import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native';


import {useAuth} from '../../hooks/auth'

import { debounce } from 'lodash'
import { Form } from '@unform/mobile';

import api from '../../services/api'


import Input from '../../components/input'

import { Container, InstitutionButton, InstitutionContainer, Header, InstitutionButtonText } from './styles';

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
    if(loading){
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

  const handlerCargoRegister = useCallback((id) => {
    console.log(id)
    navigation.navigate('CargoRegister', {
      institutionId: id
    });
  }, [])

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

  const renderFooter = useCallback(() => {
    if (!loading && ended) return null;
    if (ended) return <Text>End Of catalog</Text>;


    return <ActivityIndicator style={{ color: "#000" }} />;
  }, []);

  return (
    <Container>
      <Header>
        <Form>
          <Input
            ref={searchInput}
            name="search"
            icon="search"
            placeholder="Procure sua instituição"
            returnKeyType="send"
            onChangeText={handler}
          />
        </Form>
      </Header>
      <FlatList
        data={institutions}
        keyExtractor={item => item.id}
        onEndReached={loadInstitutionsPagination}
        onEndReachedThreshold={0.3}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
    </Container>
  )
}

export default ListInstitutions;
