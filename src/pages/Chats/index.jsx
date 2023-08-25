import { useEffect, useState } from 'react';
import * as S from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api.js';
import Loading from '../../components/loading';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export function Chats() {
  const [chats, setChats] = useState();

  const [refresh, setRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { navigate } = useNavigation();

  function onRefresh() {
    setRefreshing(true);
    setRefresh(new Date());
    setRefreshing(false);
  }

  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');

        const response = await api.get(`/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChats(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    loadChats();
  }, [refresh]);

  function renderListItem(item) {
    if (item) {
      return (
        <S.ChatCard
          onPress={() =>
            navigate('ChatDetails', {
              chat_id: item.id,
              sender: item.sender_employee.user.name,
            })
          }
        >
          <S.ContentCard>
            <S.TitleCard>{item.opener_employee.user.name}</S.TitleCard>
            <S.TextCard>
              De:{' '}
              {`${item.opener_employee.institutionAddress.city} - ${item.opener_employee.institutionAddress.state}`}
            </S.TextCard>
          </S.ContentCard>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <Feather
              name="message-circle"
              size={28}
              color="#12B500"
              style={{ alignSelf: 'flex-end' }}
            />
            <S.DateContainer>
              {moment(item.created_at).format('DD/MM/YYYY')}
            </S.DateContainer>
          </View>
        </S.ChatCard>
      );
    } else {
      return null;
    }
  }

  return (
    <S.Container>
      <Loading isVisible={loading} />
      <S.Header>
        <S.Title>Suas conversas</S.Title>
      </S.Header>
      {chats?.length > 0 ? (
        <S.ChatList
          data={chats}
          keyExtractor={(chat) => chat.id}
          renderItem={(chat) => renderListItem(chat.item)}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <S.EmptyContentView>
          <S.EmptyContentText>Nenhum chat encontrado!</S.EmptyContentText>
          <S.EmptyContentText
            style={{
              fontSize: 14,
              textDecorationLine: 'underline',
              color: '#e32245',
            }}
            onPress={() => setRefresh(new Date())}
          >
            Clique aqui para recarregar
          </S.EmptyContentText>
        </S.EmptyContentView>
      )}
    </S.Container>
  );
}
