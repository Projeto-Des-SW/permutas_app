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

import { Form } from '@unform/mobile';

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
  ForgotPasswordText,
  CreateAccountView,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

const SignIn = () => {
  const formRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { singIn } = useAuth();

  const handleSignIn = useCallback(
    async (data) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await singIn({
          email: data.email,
          password: data.password,
        });
        setLoading(false);
        // navigation.navigate('Dashboard');
      } catch (err) {
        setLoading(false);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (errors['email']) {
            Alert.alert(
              'Email inválido',
              'O email deve ser válido, confira se digitou corretamente.',
            );
          }

          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    },
    [singIn],
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
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
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
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                style={{ borderRadius: 20, backgroundColor: '#484287' }}
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPasswordComponent
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            >
              <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
            </ForgotPasswordComponent>

            <ForgotPasswordComponent
              onPress={() => {
                navigation.navigate('RedefinePassword');
              }}
            >
              {/* <ForgotPasswordText>Teste de senha</ForgotPasswordText> */}
            </ForgotPasswordComponent>
            <Keyboard>
              <InfoButton onPress={() => navigation.navigate('SignUp')}>
                Não tem uma conta? Cadastre-se
              </InfoButton>
            </Keyboard>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
