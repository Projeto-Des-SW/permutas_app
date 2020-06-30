import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesome } from '@expo/vector-icons';

import {
  Container,
  Title,
  MatchsList,
  MatchCard,
  TitleMatch,
  TextMatch,
  ContentMatch,
  MessageView,
  MessageText,
  ListContainer
} from './styles.js';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api.js';

import Loading from '../../components/loading';
import LineHeader from '../../components/lineHeader';


const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/highlights', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error.response.data);
      }
    }
    loadData();
  }, [refresh]);

  const handleRemove = (match) => {
    try {
      Alert.alert(
        'Remover',
        `Tem certeza que quer remover o match com ${match.interest_2.governmentEmployee.user.name}?`,
        [
          {
            text: 'Cancelar',
            onPress: () => { return; },
            style: 'cancel',
          },
          {
            text: 'Remover',
            onPress: () => removeMatch(match.id),
            style: 'destructive'
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const removeMatch = async (id) => {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.delete(`match/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Sucesso', 'O match foi removido!');
      setRefresh(new Date());
    } catch (error) {
      Alert.alert('Ops', 'Ocorreu um problema ao tentar remover o interesse');
      console.log(error.response.data);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    setRefresh(new Date);
    setRefreshing(false);
  }

  const renderMatch = (item) => {
    return (
      item && item.governmentEmployee && item.institution ?
        <MatchCard>
          <FontAwesome
            name={'user-circle'}
            size={70}
            color='white'
          />
          <ContentMatch>
            <TitleMatch>
              {item.governmentEmployee.user.name}
            </TitleMatch>
            <TextMatch>
              {item.institution.name}
            </TextMatch>
            <TextMatch>
              {
                item.governmentEmployee.institutionAddress &&
                item.destinationAddress &&
                `De: ${item.governmentEmployee.institutionAddress.city}/${item.governmentEmployee.institutionAddress.state} - Para: ${item.destinationAddress.city}/${item.destinationAddress.state}`}
            </TextMatch>
          </ContentMatch>
        </MatchCard>
        :
        null
    );
  };

  return (
    <Container>
      <Loading isVisible={loading} />
      <Title>
        Destaques
      </Title>
      <LineHeader />
      <ListContainer>
        {data.length > 0 ?
          <MatchsList
            data={data}
            keyExtractor={match => match.id}
            renderItem={(match) => renderMatch(match.item)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
          :
          <MessageView>
            <MessageText>Nenhum destaque encontrado!</MessageText>
            <MessageText
                style={{
                  fontSize: 14,
                  textDecorationLine: 'underline',
                  color: '#e32245',
                }}
                onPress={() => setRefresh(new Date())}
              >
                Clique aqui para recarregar
              </MessageText>
          </MessageView>
        }
      </ListContainer>
    </Container>
  );
};

export default Dashboard;
