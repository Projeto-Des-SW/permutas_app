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
import { parseSolicitationStatus } from '../../utils/parseSolicitationsStatus.js';

const InterestList = () => {
  const { signOut, user } = useAuth();
  const [data, setData] = useState([]);
  const [solicitations, setSolicitations] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [refresh, setRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [value, setValue] = useState('interests');
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [indexSolicitationSelected, setIndexSolicitationSelected] =
    useState(-1);

  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadInterests() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/interest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
      setLoading(false);
    }

    async function loadCandidates() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.get('/solicitations/candidates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCandidates(response.data);
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
            Authorization: `Bearer ${token}`,
          },
        });
        setSolicitations(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
      setLoading(false);
    }

    if (value === 'interests') loadInterests();
    if (value === 'candidates') loadCandidates();
    if (value === 'solicitations') loadSolicitations();
  }, [refresh, value]);

  const handleRegister = () => {
    navigate('InterestRegister');
  };

  const handleRemove = (item) => {
    try {
      Alert.alert(
        'Remover',
        `Tem certeza que quer remover o interesse em: ${item.institution.name}`,
        [
          {
            text: 'Cancelar',
            onPress: () => {
              return;
            },
            style: 'cancel',
          },
          {
            text: 'Remover',
            onPress: () => removeInterest(item.id),
            style: 'destructive',
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeInterest = async (id) => {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.delete(`interest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefresh(new Date());
      Alert.alert('Sucesso', 'O interesse foi removido!');
    } catch (error) {
      Alert.alert('Ops', 'Ocorreu um problema ao tentar remover o interesse');
      console.log(error.response.data);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setRefresh(new Date());
    setRefreshing(false);
  };

  const renderItem = (item) => {
    return item ? (
      <InterestCard>
        <ContentInterest>
          <TitleInterest>{item.institution.name}</TitleInterest>
          <TextInterest>
            {item.destinationAddress &&
              item.destinationAddress.city +
                ' - ' +
                item.destinationAddress.state}
          </TextInterest>
        </ContentInterest>
        <View style={{ height: '100%', justifyContent: 'space-between' }}>
          <Feather
            name={'x'}
            size={30}
            style={{ alignSelf: 'flex-end' }}
            color="red"
            onPress={() => handleRemove(item)}
          />
          <DateInterest>
            {moment(item.created_at.get).format('DD/MM/YYYY')}
          </DateInterest>
        </View>
      </InterestCard>
    ) : null;
  };

  const renderSolicitations = (solicitation, index) => {
    if (solicitation.governmentEmployeeSender.user_id === user.id) {
      return (
        <SolicitationCard
          onPress={() => openModal(index, true)}
          disabled={true}
        >
          <FontAwesome name={'user-circle'} size={70} color="white" />
          <ContentSolicitation>
            <TitleSolicitation>
              {solicitation.governmentEmployeeReceiver.user.name}
            </TitleSolicitation>
            <TextSolicitation>
              De:{' '}
              {`${solicitation.governmentEmployeeReceiver.institutionAddress.city} - ${solicitation.governmentEmployeeReceiver.institutionAddress.state}`}
            </TextSolicitation>
          </ContentSolicitation>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <TextSolicitation style={{ fontSize: 12 }}>
              {parseSolicitationStatus(solicitation.status)}
            </TextSolicitation>
          </View>
        </SolicitationCard>
      );
    } else {
      return (
        <SolicitationCard
          onPress={() => openModal(index, false)}
          disabled={solicitation.status !== 'pending'}
        >
          <FontAwesome name={'user-circle'} size={70} color="white" />
          <ContentSolicitation>
            <TitleSolicitation>
              {solicitation.governmentEmployeeSender.user.name}
            </TitleSolicitation>
            <TextSolicitation>
              De:{' '}
              {`${solicitation.governmentEmployeeSender.institutionAddress.city} - ${solicitation.governmentEmployeeSender.institutionAddress.state}`}
            </TextSolicitation>
          </ContentSolicitation>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            {solicitation.status === 'pending' && (
              <Feather
                name="arrow-right"
                size={28}
                color="#12B500"
                style={{ alignSelf: 'flex-end' }}
              />
            )}
            <TextSolicitation style={{ fontSize: 12 }}>
              {parseSolicitationStatus(solicitation.status)}
            </TextSolicitation>
          </View>
        </SolicitationCard>
      );
    }
  };

  const toggleModal = () => {
    setOpenSolicitationModal(!openSolicitationModal);
  };

  function openModal(index, solicitation) {
    if (solicitation) {
      const item = solicitations[index];
      setItemSelected(item.governmentEmployeeReceiver);
    } else {
      const item = candidates[index];
      setItemSelected(item.governmentEmployeeSender);
    }
    setIndexSolicitationSelected(index);
    toggleModal();
  }

  const confirmSolicitation = async () => {
    try {
      if (
        indexSolicitationSelected < 0 ||
        indexSolicitationSelected >= candidates.length
      )
        return;

      setOpenSolicitationModal(false);
      setLoading(true);
      const { id } = candidates[indexSolicitationSelected];
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.put(
        `/solicitations/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);

      Alert.alert(
        'Sucesso',
        'A solicitação foi ACEITA, entre em contato com o servidor!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigate('ChatDetails', { chat_id: response.data.id });
            },
          },
        ],
        { cancelable: false },
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
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const declineSolicitation = async () => {
    try {
      if (
        indexSolicitationSelected < 0 ||
        indexSolicitationSelected >= solicitations.length
      )
        return;

      setOpenSolicitationModal(false);
      setLoading(true);
      const { id } = solicitations[indexSolicitationSelected];
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.put(
        `/solicitations/${id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);

      Alert.alert(
        'Sucesso',
        'A solicitação foi RECUSADA!',
        [
          {
            text: 'OK',
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: false },
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
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  function renderPageContent() {
    if (value === 'interests') {
      if (data.length > 0) {
        return (
          <InterestsList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderItem(item.item)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      } else {
        return (
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
        );
      }
    } else if (value === 'candidates') {
      if (candidates.length > 0) {
        return (
          <InterestsList
            data={candidates}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => renderSolicitations(item, index)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      } else {
        return (
          <MessageView>
            <MessageText>Nenhum candidato encontrado!</MessageText>
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
        );
      }
    } else if (value === 'solicitations') {
      if (solicitations.length > 0) {
        return (
          <InterestsList
            data={solicitations}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => renderSolicitations(item, index)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      } else {
        return (
          <MessageView>
            <MessageText>
              Nenhuma solicitação de permuta sua encontrada!
            </MessageText>
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
        );
      }
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
      <Title>Interesses</Title>
      <LineHeader />
      <HeaderButtons>
        <Button
          onPress={() => setValue('interests')}
          style={{
            height: 42,
            width: '30%',
            backgroundColor: value === 'interests' ? '#262347' : '#25242e',
          }}
        >
          Interesses
        </Button>
        <Button
          onPress={() => setValue('candidates')}
          style={{
            height: 42,
            width: '30%',
            backgroundColor: value === 'candidates' ? '#262347' : '#25242e',
          }}
        >
          Candidatos
        </Button>
        <Button
          onPress={() => setValue('solicitations')}
          style={{
            height: 42,
            width: '30%',
            backgroundColor: value === 'solicitations' ? '#262347' : '#25242e',
          }}
        >
          Solicitações
        </Button>
      </HeaderButtons>
      <ListContainer>{renderPageContent()}</ListContainer>
      {value === 'interests' && (
        <Button onPress={handleRegister} style={{ width: '100%' }}>
          Novo Interesse
        </Button>
      )}
    </Container>
  );
};

export default InterestList;
