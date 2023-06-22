import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesome, Feather } from '@expo/vector-icons';

import {
  Container,
  Title,
  InterestsList,
  InterestCard,
  TitleInterest,
  TextInterest,
  ContentInterest,
  MessageView,
  MessageText,
  DateInterest,
  ListContainer,
  HeaderButtons,
  SolicitationCard,
  ContentSolicitation,
  TitleSolicitation,
  TextSolicitation,
} from './styles.js';

import Button from '../../components/button';
import Loading from '../../components/loading';
import LineHeader from '../../components/lineHeader';
import CandidateModal from '../../components/candidateModal';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api.js';


const InterestList = () => {
  const { signOut, user } = useAuth();
  const [data, setData] = useState([]);
  const [dataSolicitations, setDataSolicitations] = useState([]);

  const [refresh, setRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [value, setValue] = useState(1);
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [indexSolicitationSelected, setIndexSolicitationSelected] = useState(-1);

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

    async function loadSolicitations() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/solicitations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDataSolicitations(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
      setLoading(false);
    }

    if (value === 1) loadInterests();
    if (value === 2) loadSolicitations();

  }, [refresh, value]);

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

  const onRefresh = () => {
    setRefreshing(true);
    setRefresh(new Date());
    setRefreshing(false);
  }

  const renderItem = (item) => {
    return (
      item ?
        <InterestCard>
          <ContentInterest>
            <TitleInterest>
              {item.institution.name}
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

  const renderSolicitations = (solicitation, index) => {
    if (solicitation.governmentEmployeeSender.user_id === user.id) {
      return (
        <SolicitationCard onPress={() => openModal(index)}>
          <FontAwesome
            name={'user-circle'}
            size={70}
            color='white'
          />
          <ContentSolicitation>
            <TitleSolicitation>
              {solicitation.governmentEmployeeReceiver.user.name}
            </TitleSolicitation>
            <TextSolicitation>
              De: {`${solicitation.governmentEmployeeReceiver.institutionAddress.city} - ${solicitation.governmentEmployeeReceiver.institutionAddress.state}`}
            </TextSolicitation>
          </ContentSolicitation>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <Feather
              name="arrow-right"
              size={28}
              color="#12B500"
              style={{ alignSelf: 'flex-end' }}
            />
            <TextSolicitation style={{ fontSize: 12 }}>
              {solicitation.status}
            </TextSolicitation>
          </View>
        </SolicitationCard>
      );
    } else {
      return (
        <SolicitationCard onPress={() => openModal(index)}>
          <FontAwesome
            name={'user-circle'}
            size={70}
            color='white'
          />
          <ContentSolicitation>
            <TitleSolicitation>
              {solicitation.governmentEmployeeSender.user.name}
            </TitleSolicitation>
            <TextSolicitation>
              De: {`${solicitation.governmentEmployeeSender.institutionAddress.city} - ${solicitation.governmentEmployeeSender.institutionAddress.state}`}
            </TextSolicitation>
          </ContentSolicitation>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <Feather
              name="arrow-left"
              size={28}
              color="#E32245"
              style={{ alignSelf: 'flex-end' }}
            />
            <TextSolicitation style={{ fontSize: 12 }}>
              {solicitation.status}
            </TextSolicitation>
          </View>
        </SolicitationCard>
      );
    }
  }

  const toggleModal = () => {
    setOpenSolicitationModal(!openSolicitationModal);
  };

  const openModal = (index) => {
    const item = dataSolicitations[index];
    if (item.governmentEmployeeSender.user_id === user.id) {
      setItemSelected(item.governmentEmployeeReceiver);
    } else {
      setItemSelected(item.governmentEmployeeSender);
    }
    setIndexSolicitationSelected(index);
    toggleModal();
  };

  const confirmSolicitation = async () => {
    try {
      if (indexSolicitationSelected < 0 || indexSolicitationSelected >= dataSolicitations.length) return;

      setOpenSolicitationModal(false);
      setLoading(true);
      const { id } = dataSolicitations[indexSolicitationSelected];
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.put(`/solicitations/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);

      Alert.alert(
        'Sucesso',
        'A solicitação foi ACEITA, entre em contato com o servidor!',
        [
          {
            text: 'OK',
            onPress: () => { return; },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error.response.data);
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

  const declineSolicitation = async () => {
    try {
      if (indexSolicitationSelected < 0 || indexSolicitationSelected >= dataSolicitations.length) return;

      setOpenSolicitationModal(false);
      setLoading(true);
      const { id } = dataSolicitations[indexSolicitationSelected];
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.put(`/solicitations/${id}/decline`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);

      Alert.alert(
        'Sucesso',
        'A solicitação foi RECUSADA!',
        [
          {
            text: 'OK',
            onPress: () => { return; },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error.response.data);
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
      <CandidateModal
        item={itemSelected}
        isVisible={openSolicitationModal}
        toggleModal={toggleModal}
        confirmSolicitation={confirmSolicitation}
        declineSolicitation={declineSolicitation}
      />
      <Title>
        Interesses
      </Title>
      <LineHeader />
      <HeaderButtons>
        <Button
          onPress={() => setValue(1)}
          style={{
            height: 42,
            width: '48%',
            backgroundColor: value === 1 ? '#464A81' : '#2D2D39',
          }}
        >
          Interesses
        </Button>
        <Button
          onPress={() => setValue(2)}
          style={{
            height: 42,
            width: '48%',
            backgroundColor: value === 2 ? '#464A81' : '#2D2D39',
          }}
        >
          Candidatos
        </Button>
      </HeaderButtons>
      <ListContainer>
        {
          value === 1
            ?
            data.length > 0
              ?
              <InterestsList
                data={data}
                keyExtractor={item => item.id}
                renderItem={(item) => renderItem(item.item)}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
              :
              <MessageView>
                <MessageText>Nenhum interesse encontrado!</MessageText>
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
            :
            dataSolicitations.length > 0
              ?
              <InterestsList
                data={dataSolicitations}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => renderSolicitations(item, index)}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
              :
              <MessageView>
                <MessageText>Nenhuma solicitação encontrada!</MessageText>
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
      {
        value === 1 &&
        <Button onPress={handleRegister} style={{ width: '100%' }}>
          Novo Interesse
        </Button>
      }
    </Container>
  );
};

export default InterestList;
