import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons, Feather } from '@expo/vector-icons';

import {
  Container,
  Card,
  TextCard,
  InterestsList,
  InterestCard,
  TitleInterest,
  TextInterest,
  ContentInterest,
  MessageView,
  MessageText,
  DateInterest
} from './styles.js';

import Button from '../../components/button';
import Loading from '../../components/loading'

import { useAuth } from '../../hooks/auth';
import api from '../../services/api.js';


const InterestList = () => {
  const { signOut, user } = useAuth();
  const [data, setData] = useState([]);

  const [refresh, setRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadInterests() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/interest', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
      setLoading(false);
    }
    loadInterests();
  }, [refresh]);

  const handleRegister = () => {
    navigate('InterestRegister');
  }

  const handleRemove = (item) => {
    try {
      Alert.alert(
        'Remover',
        `Tem certeza que quer remover o interesse em: ${item.institution.name}`,
        [
          {
            text: 'Cancelar',
            onPress: () => { return; },
            style: 'cancel',
          },
          {
            text: 'Remover',
            onPress: () => removeInterest(item.id),
            style: 'destructive'
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const removeInterest = async (id) => {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.delete(`interest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRefresh(new Date());
      Alert.alert('Sucesso', 'O interesse foi removido!');
    } catch (error) {
      Alert.alert('Ops', 'Ocorreu um problema ao tentar remover o interesse');
      console.log(error.response.data);
    }
  }

  const renderItem = (item) => {
    return (
      item ?
        <InterestCard>
          <Ionicons
            name={'ios-business'}
            size={35}
            color='white'
          />
          <ContentInterest>
            <TitleInterest>
              Instituição: {item.institution.name}
            </TitleInterest>
            <TextInterest>
              {item.destinationAddress && item.destinationAddress.city + ' - ' + item.destinationAddress.state}
            </TextInterest>
          </ContentInterest>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <Feather
              name={'x'}
              size={30}
              style={{ alignSelf: 'flex-end' }}
              color='red'
              onPress={() => handleRemove(item)}
            />
            <DateInterest>
              {moment(item.created_at.get).format("DD/MM/YYYY")}
            </DateInterest>
          </View>
        </InterestCard>
        :
        null
    );
  };

  return (
    <Container>
      <Loading isVisible={loading} />
      <Card>
        <TextCard>
          Interesses: {data.length}
        </TextCard>
      </Card>
      {
        data.length > 0
          ?
          <InterestsList
            data={data}
            keyExtractor={item => item.id}
            renderItem={(item) => renderItem(item.item)}
          />
          :
          <MessageView>
            <MessageText>Você não possui nenhum interesse!</MessageText>
          </MessageView>
      }
      <View style={{ width: '100%', marginTop: 30 }}>
        <Button onPress={handleRegister}>Novo Interesse</Button>
      </View>
    </Container>
  );
};

export default InterestList;
