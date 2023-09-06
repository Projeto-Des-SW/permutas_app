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

const ForgotPassword = () => {
  const formRef = useRef(null);
  // const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // const { singIn } = useAuth();

  const handleSubmit = async (data) => {
    try {
      formRef.current?.setErrors({});

      const ForgotPasswordFormData = {
        email: data.email,
      };

      const schema = Yup.object().shape({
        email: Yup.string().required('Instituição obrigatória'),
      });

      await schema.validate(ForgotPasswordFormData, {
        abortEarly: false,
      });

      console.log(data.email);

      const response = await api.post(
        '/forgotPassword',
        ForgotPasswordFormData,
      );

      console.log(response);

      Alert.alert('Sucesso!', 'O email foi enviado!');
      navigation.navigate('SignIn');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }
      console.log(err);
      Alert.alert(
        'Erro no cadastro',
        ' Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
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
              <SubTitle>Informe o seu email</SubTitle>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
              />

              <Button
                style={{ borderRadius: 20, backgroundColor: '#484287' }}
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Continuar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ForgotPassword;
