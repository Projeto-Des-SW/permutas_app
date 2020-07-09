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
import SolicitationModal from '../../components/solicitationModal';


const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(new Date());
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [itemSelected, setItemSelected] = useState({});

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

  const onRefresh = () => {
    setRefreshing(true);
    setRefresh(new Date);
    setRefreshing(false);
  }

  const renderMatch = (item, index) => {
    return (
      item && item.governmentEmployee && item.institution ?
        <MatchCard onPress={() => openModal(index, item.id)}>
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

  const toggleModal = () => {
    setOpenSolicitationModal(!openSolicitationModal);
  };

  const openModal = (index, id) => {
    const item = data[index];
    setItemSelected(item);
    toggleModal();
  };

  return (
    <Container>
      <Loading isVisible={loading} />
      <SolicitationModal
        item={itemSelected}
        isVisible={openSolicitationModal}
        toggleModal={toggleModal}
      />
      <Title>
        Destaques
      </Title>
      <LineHeader />
      <ListContainer>
        {data.length > 0 ?
          <MatchsList
            data={data}
            keyExtractor={match => match.id}
            renderItem={({ item, index }) => renderMatch(item, index)}
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
