import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';

import { Container, Title, BackToProfile, BackToProfileText } from './styles';


const EditUserData = () => {
  const formRef = useRef(null);
  const nomeInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { navigate, goBack } = useNavigation();

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

  const handleSaveEdit = useCallback(
    async (data) => {
      try {
        setLoading(true)
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = await AsyncStorage.getItem('@Permutas:token');
        await api.put('/users', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLoading(false)

        Alert.alert('Dados atualizados com sucesso!');

        goBack();

      } catch (err) {
        setLoading(false)
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
              <Title>Alterar Dados</Title>
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
              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <Keyboard>
        <BackToProfile onPress={() => goBack()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
          <BackToProfileText> Voltar para o perfil </BackToProfileText>
        </BackToProfile>
      </Keyboard>
    </>
  );
};

export default EditUserData;