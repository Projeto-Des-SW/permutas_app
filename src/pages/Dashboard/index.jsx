import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Alert, Text, TouchableOpacity } from 'react-native';

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
  ListContainer,
  Header
} from './styles.js';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api.js';

import Loading from '../../components/loading';
import LineHeader from '../../components/lineHeader';
import SolicitationModal from '../../components/solicitationModal';
import FilterModal from '../../components/filterHighlights';


const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(new Date());
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [visibleFilter, setVisibleFilter] = useState(false);


  useEffect(() => {

    loadData();
  }, [refresh]);

  async function loadData(state='', city='', institution='') {
    try {
      console.log(state, city, institution)
      setLoading(true)
      const token = await AsyncStorage.getItem('@Permutas:token');
      const response = await api.get(`/highlights?state=${state}&city=${city}&institution=${institution}`, {
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

  const toggleFilterModal = () => {

    setVisibleFilter(!visibleFilter);
  }

  const toggleModal = () => {
    setOpenSolicitationModal(!openSolicitationModal);
  };

  const openModal = (index, id) => {
    const item = data[index];
    setItemSelected(item);
    toggleModal();
  };

  const createSolicitation = async (interest_id) => {
    try {
      setOpenSolicitationModal(false);
      setLoading(true);
      const token = await AsyncStorage.getItem('@Permutas:token');
      await api.post('/solicitations', { interest_id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);

      Alert.alert(
        'Sucesso',
        'A solicitação foi enviada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => { return; },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert(
        'Ops',
        'Ocorreu um problema ao enviar a solicitação, tente novamente.',
        [
          {
            text: 'OK',
            onPress: () => { return; },
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <Container>
      <Loading isVisible={loading} />
      <SolicitationModal
        item={itemSelected}
        isVisible={openSolicitationModal}
        toggleModal={toggleModal}
        createSolicitation={createSolicitation}
      />
      <Header>
        <Title>
          Destaques
        </Title>
        <TouchableOpacity onPress={() => toggleFilterModal()}>
          <FontAwesome
            name={'filter'}
            size={20}
            color='white'
          />
        </TouchableOpacity>
      </Header>
      <FilterModal
        isVisible={visibleFilter}
        toggleModal={toggleFilterModal}
        filterFunction={loadData}
      />

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
