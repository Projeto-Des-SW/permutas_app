import React from 'react';
import { View, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

import { Feather } from '@expo/vector-icons';

import {
  Container,
  Title,
  Card,
  TextCard,
  MatchsList,
  MatchCard,
  TextMatch
} from './styles.js';

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const data = ['Match teste', 'Match teste 2'];

  const renderMatch = (match) => {
    return (
      <MatchCard>
        <Feather
          name={'user'}
          size={20}
        />
        <TextMatch>
          {match}
        </TextMatch>
      </MatchCard>
    );
  };

  return (
      <Container>
        <Title onPress={() => signOut()}>
          Bem-Vindo, {user.name}
        </Title>
        <Card>
          <TextCard>
            Interesses: {1}
          </TextCard>
          <TextCard>
            Matchs: {data.length}
          </TextCard>
        </Card>
        <MatchsList
          data={data}
          keyExtractor={item => item}
          renderItem={({ item }) => renderMatch(item)}
        />
      </Container>
  );
};

export default Dashboard;
