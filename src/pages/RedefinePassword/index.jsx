import React, { useRef, useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Text,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';

import { Form } from '@unform/mobile';
import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErros';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';
import InfoButton from '../../components/infoButton';

import logo from '../../../assets/logo-2.png';

import {
  Container,
  Title,
  ForgotPassword as ForgotPasswordComponent,
  SubTitle,
  CreateAccountView,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

const RedefinePassword = () => {
  const formRef = useRef(null);
  // const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const confirmPasswordRef = useRef(null);
  const passwordInputRef = useRef(null);

  const navigation = useNavigation();

  //const params = new URLSearchParams(window.location.search);
  //const token = params.get('token');
  // const { singIn } = useAuth();

  const handleSubmit = async (data) => {
    try {
      formRef.current?.setErrors({});

      const RedefinePasswordFormData = {
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const schema = Yup.object().shape({
        password: Yup.string()
          .required('Senha obrigatória')
          .min(6, 'Digite pelo menos 6 caracteres'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')])
          .required('Confirmação de senha obrigatoria')
          .min(6, 'Digite pelo menos 6 caracteres'),
      });

      await schema.validate(RedefinePasswordFormData, {
        abortEarly: false,
      });

      await api.put('/users/password', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);

      Alert.alert('Dados atualizados com sucesso!');
      navigation.navigate('SignIn');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        if (errors['confirmPassword']) {
          Alert.alert(
            'Falha ao confirmar senha.',
            'As senhas devem ser iguais, confira se digitou corretamente.',
          );
        }

        formRef.current?.setErrors(errors);

        return;
      }
      console.log(err);
      Alert.alert('Erro', ' Ocorreu um erro, tente novamente.');
    }
  };

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
            <Image
              source={logo}
              style={{
                width: 400,
                height: 400,
                borderRadius: 0,
                opacity: 0.5,
                position: 'absolute',
              }}
            />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <SubTitle>Informe a sua nova senha</SubTitle>
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={confirmPasswordRef}
                secureTextEntry
                name="confirmPassword"
                icon="lock"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                style={{ borderRadius: 20, backgroundColor: '#484287' }}
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RedefinePassword;
