import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
  MessageText
} from './styles.js';

import Button from '../../components/button';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api.js';


const Dashboard = () => {
  const { signOut, user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadInterests() {
      try {
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
    }
    loadInterests();
  }, []);

  const renderItem = (item) => {
    return (
      item ?
        <InterestCard>
          <Ionicons
            name={'ios-business'}
            size={35}
          />
          <ContentInterest>
            <TitleInterest>
              Instituição: {item.institution.name}
            </TitleInterest>
            <TextInterest>
              Local: -
            </TextInterest>
          </ContentInterest>
        </InterestCard>
        :
        null
    );
  };

  return (
    <Container>
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
            <MessageText>Você ainda não possui nenhum interesse!</MessageText>
          </MessageView>
      }
      <View style={{ width: '100%', marginTop: 30 }}>
        <Button onPress={() => { }}>Novo Interesse</Button>
      </View>
    </Container>
  );
};

export default Dashboard;
