import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';

import { Container, Title, HelperText } from './styles';

import Input from '../../../components/input';
import Button from '../../../components/button';
import Loading from '../../../components/loading';

import api from '../../../services/api';

import { useAuth } from '../../../hooks/auth';

const FirstStep = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const { signOut } = useAuth();

  const handleConfirm = useCallback(async ({ cpf }) => {
    try {
      setLoading(true);
      if (cpf) {
        const response = await api.get(`government-employee/cpf?cpf=${cpf}`);
        goToSecondStep(response.data);
      } else {
        Alert.alert('Atenção', 'Por favor informe o seu CPF');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.toString());
      Alert.alert(
        'Ops...',
        'Ocorreu um problema ao tentar consultar os dados, tente novamente!',
      );
    }
  }, []);

  const goToSecondStep = useCallback((date) => {
    navigate('SecondStep', date);
  }, [navigate]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Container>
        <Loading isVisible={loading} />
        <Title onPress={() => signOut()}>Informe seu CPF</Title>
        <Form
          ref={formRef}
          onSubmit={handleConfirm}
          style={{ marginTop: 20 }}
        >
          <Input
            name="cpf"
            icon="user"
            placeholder="CPF"
            returnKeyType="done"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />
          <Button
            onPress={() => formRef.current?.submitForm()}
          >
            Confirmar
          </Button>
          <HelperText>*Seu CPF será usado apenas para obtermos suas informações como servidor publico.</HelperText>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}

export default FirstStep;
