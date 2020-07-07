import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';
import { Form } from '@unform/mobile';
import { Feather } from '@expo/vector-icons';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Title, BackToProfile, BackToProfileText } from './styles';

import * as Yup from 'yup';

const EditUserData = () => {
  const formRef = useRef(null);
  const nomeInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const oldPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const { navigate } = useNavigation();

  useEffect(() => {
    async function getUserData() {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const { name, email} = response.data;

      formRef.current.setData({name, email});
    }
    getUserData();
  }, [])

  function modificarValores(order, value) {
    switch (order) {
      case 0:
        setNome(value);
        break;
      case 1:
        setEmail(value);
        break;
    }
  }

  const handleSaveEdit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          oldPassword: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Digite pelo menos 6 caracteres'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Digite pelo menos 6 caracteres'),
        });
        console.log("alooooooooou")
        console.log(data);

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = await AsyncStorage.getItem('@Permutas:token');
        const response = await api.put('/users', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Alert.alert('Dados atualizados com sucesso!');

        navigate('Profile')

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        console.log(err.toString());
        Alert.alert(
          'Erro no cadastro',
          ' Ocorreu um erro ao fazer cadastro, tente novamente.',
        );
      }
    },
    [navigate],

  );


  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Loading isVisible={loading} />
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <View>
              <Title>Editar seus dados</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSaveEdit}>
              <Input
                ref={nomeInputRef}
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="oldPassword"
                icon="lock"
                placeholder="Senha antiga"
                textContentType="oldPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  newPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={newPasswordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <Keyboard>
        <BackToProfile onPress={() => navigate('Profile')}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
          <BackToProfileText> Voltar para o perfil </BackToProfileText>
        </BackToProfile>
      </Keyboard>
    </>
  );
};

export default EditUserData;