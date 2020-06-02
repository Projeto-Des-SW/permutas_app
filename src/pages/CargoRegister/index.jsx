import React, { useRef, useCallback } from 'react';

import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { Container, Title } from './styles';
import Button from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/mobile';

import getValidationErrors from '../../utils/getValidationErros';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

const CargoRegister = () => {
  const navigation = useNavigation();

  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const titrationInputRef = useRef(null);
  const qualificationInputRef = useRef(null);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do cargo obrigatório'),
          titration: Yup.string().required('Titulação obrigatória'),
          qualification: Yup.string().required('Formação obrigatória')
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = await AsyncStorage.getItem('@Permutas:token');

        const response = await api.post('position', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { id } = response.data;
        console.log(id);

        Alert.alert('Sucesso!', 'Cargo cadastrado.');
        navigation.navigate('Dashboard');

      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
          return;
        }
        console.log(error.toString());

        Alert.alert(
          'Ocorreu um problema',
          error.toString(),
        );
      }
    }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <View>
              <Title>Informações do Cargo</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="clipboard"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  nameInputRef.current?.focus();
                }}
              />

              <Input
                ref={titrationInputRef}
                name="titration"
                icon="bookmark"
                placeholder="Titulação"
                returnKeyType="next"
                onSubmitEditing={() => {
                  titrationInputRef.current?.focus();
                }}
              />
              <Input
                ref={qualificationInputRef}
                name="qualification"
                icon="award"
                placeholder="Formação"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CargoRegister;
