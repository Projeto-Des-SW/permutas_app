import React, { useRef, useCallback, useState } from 'react';
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

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';
import InfoButton from '../../components/infoButton'

import logo from '../../../assets/logo.png';

import { Container, Title } from './styles';


const SignUp = () => {
  const { navigate } = useNavigation();

  const formRef = useRef(null);

  const emailInputRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  const handleSignUp = useCallback(
    async (data) => {
      setLoading(true)
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Digite pelo menos 6 caracteres'),
          confirmPassword: Yup.string().oneOf([Yup.ref('password')])
            .required('Confirmação de senha obrigatoria')
            .min(6, 'Digite pelo menos 6 caracteres'),

        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('/users', data);

        Alert.alert('Cadastro realizado com sucesso!');

        await signUp(response.data.session);
        setLoading(false)
        // navigate('FirstStep');
      } catch (err) {
        setLoading(false)
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors)

          if(errors['confirmPassword']) {
            Alert.alert(
              'Falha ao confirmar senha.',
              'As senhas devem ser iguais, confira se digitou corretamente.',
            );
          }

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
        <Loading isVisible={loading}/>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logo} style={{width: 190, height:150}} />
            <View>
              <Title>Cadastre-se para localizar uma pessoa interessada na permuta.</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
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

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>

            <Keyboard>
              <InfoButton onPress={() => navigate('SignIn')}>
                Tem uma conta? Conecte-se
              </InfoButton>
            </Keyboard>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
};

export default SignUp;
