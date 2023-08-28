import { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import Loading from '../../../components/loading';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../../services/api.js';
import io from 'socket.io-client';
import { FontAwesome, Feather } from '@expo/vector-icons';
import Input from '../../../components/input';
import { Form } from '@unform/mobile';

import { Alert, Keyboard } from 'react-native';
import { useAuth } from '../../../hooks/auth';

import { REACT_APP_API_URL, REACT_APP_AVATAR_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

export function ChatDetails({ route }) {
  const { chat_id } = route.params;

  const { user } = useAuth();
  const { sender_name } = route.params;
  const [chat, setChat] = useState();
  const [messages, setMessages] = useState();

  const [refresh, setRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState('');
  const formRef = useRef(null);
  const flatListRef = useRef(null);

  const socket = io(REACT_APP_API_URL);
  const navigation = useNavigation();

  function onRefresh() {
    setRefreshing(true);
    setRefresh(new Date());
    setRefreshing(false);
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the socket server!');

      socket.emit('join_chat', { chat_id });
    });

    socket.on('receive_message', (data) => {
      setMessages((state) => [...state, data]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the socket server!');
    });

    return () => {
      socket.disconnect();
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    async function loadChat() {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('@Permutas:token');

        const response = await api.get(`/chats/${chat_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChat(response.data);
        setMessages(response.data.messages);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    loadChat();
  }, [refresh]);

  function renderListItem(item) {
    if (item) {
      const sender = item.sender_relation.user.id === user.id;

      return (
        <S.MessageContainer sender={sender}>
          {item.sender_relation.user.avatar ? (
            <S.AvatarImg
              source={{
                uri: `${REACT_APP_API_URL}/${REACT_APP_AVATAR_URL}/${item.sender_relation.user.avatar}`,
              }}
            />
          ) : (
            <FontAwesome name={'user-circle'} size={35} color="white" />
          )}
          <S.MessageTextContainer sender={sender}>
            <S.MessageText>{item.text}</S.MessageText>
            <S.MessageDate>
              <S.DateText>
                {new Date(item.createdAt).toLocaleString()}
              </S.DateText>
            </S.MessageDate>
          </S.MessageTextContainer>
        </S.MessageContainer>
      );
    } else {
      return null;
    }
  }

  async function handleSubmit(message) {
    try {
      if (message !== '') {
        socket.emit('send_message', {
          user_id: user.id,
          chat: chat_id,
          message,
        });
        setMessage('');
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Erro ao enviar mensagem',
        'Ocorreu um erro ao tentar enviar mensagem, tente novamente.',
      );
    }
  }

  return (
    <S.Container>
      <Loading isVisible={loading} />
      <S.Header>
        <S.Title>{`Chat com ${sender_name}`}</S.Title>
      </S.Header>
      <S.ChatContainer>
        {messages?.length > 0 ? (
          <S.MessageList
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={(message) => renderListItem(message.item)}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ref={flatListRef}
            onContentSizeChange={() => {
              if (flatListRef.current && messages && messages.length > 0) {
                flatListRef.current.scrollToEnd();
              }
            }}
          />
        ) : (
          <S.EmptyContentView>
            <S.EmptyContentText>
              Nenhuma mensagem encontrada!
            </S.EmptyContentText>
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
        <S.InputBtnContainer>
          <S.InputContainer>
            <Form ref={formRef} onSubmit={() => handleSubmit(message)}>
              <Input
                onChangeText={(value) => setMessage(value)}
                name="message"
                placeholder="Escreva sua mensagem..."
                value={message}
              />
            </Form>
          </S.InputContainer>
          <S.SendBtn onPress={() => formRef.current?.submitForm()}>
            <Feather name="send" size={40} color="#2D2D39" />
          </S.SendBtn>
        </S.InputBtnContainer>
      </S.ChatContainer>
      <S.BackToChat onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={20} color="#ffffff" />
        <S.BackToChatText> Voltar para todas as conversas </S.BackToChatText>
      </S.BackToChat>
    </S.Container>
  );
}
