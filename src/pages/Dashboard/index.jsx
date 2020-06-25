import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import {
  Container,
  Title,
  Card,
  TextCard,
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


const Dashboard = () => {
  const { user } = useAuth();
  // const data = ['Match teste', 'Match teste 2', 'Match teste 3', 'Match teste 4'];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadMatchs() {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/match', { headers: {
          Authorization: `Bearer ${token}`
        }});

        setData(response.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error.response.data);
        // Alert.alert('Ops', 'Ocorreu um erro ao buscar os MATCHS!');
      }
    }
    loadMatchs();
  }, []);

  const renderMatch = (match) => {
    return (
      match ?
      <MatchCard>
        <Feather
          name={'user'}
          size={35}
          color='white'
        />
        <ContentMatch>
          <TitleMatch>
            {match.interest_2.governmentEmployee.user.name}
          </TitleMatch>
          <TextMatch>
            {match.interest_2.institution.name}
          </TextMatch>
        </ContentMatch>
        <Feather
            name={'x'}
            size={30}
            style={{ alignSelf: 'flex-start'}}
            color='red'
            onPress={() => handleRemove(item)}
          />
      </MatchCard>
      :
      null
    );
  };

  return (
    <Container>
      <Loading isVisible={loading} />
      <Title>
        Bem-Vindo, {user.name}
      </Title>
      <Card>
        <TextCard>
          Matchs: {data.length}
        </TextCard>
      </Card>
      <ListContainer>
        {data.length > 0 ?
          <MatchsList
            data={data}
            keyExtractor={match => match.id}
            renderItem={(match) => renderMatch(match.item)}
          />
          :
          <MessageView>
            <MessageText>Você não possui nenhum Match!</MessageText>
          </MessageView>
        }
      </ListContainer>
    </Container>
  );
};

export default Dashboard;
