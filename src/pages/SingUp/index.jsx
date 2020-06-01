import React, { useRef, useCallback } from 'react';
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
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';

// import logo from '../../assets/logo.png';

import { Container, Title, BackToSign, BackToSignText } from './styles';


const SignUp = () => {
  const navigate = useNavigation();

  const formRef = useRef(null);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleSignUp = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string()
            .required('Senha obrigatoria')
            .min(6, 'Digite pelo menos 6 caracteres'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        );

        navigate.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
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
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            {/* <Image source={logo} /> */}
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
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
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
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
      <Keyboard>
        <BackToSign onPress={() => navigate.goBack()}>
          <Feather name="arrow-left" size={20} color="#7c60f7" />
          <BackToSignText> Voltar para login </BackToSignText>
        </BackToSign>
      </Keyboard>
    </>
  );
};

export default SignUp;
