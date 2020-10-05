import React, { useRef, useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';

import { Container, Title, HelperText, LinkText } from './styles';

import Input from '../../../components/input';
import Button from '../../../components/button';
import Loading from '../../../components/loading';

import api from '../../../services/api';


const FirstStep = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const handleConfirm = useCallback(async ({ cpf }) => {
    try {
      setLoading(true);
      if (cpf) {
        const response = await api.post('government-employee/cpf', { cpf });

        if (!response?.data.error) {
          alert('encontrou');
          // aqui direcionar para tela de confirmação;
        } else {
          Alert.alert(
            'Dados não encontrados',
            'Deseja inserir as informações manualmente?',
            [
              {
                text: 'NÃO',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'SIM', onPress: () => goToSecondStep() }
            ],
            { cancelable: false }
          );
        }
      } else {
        Alert.alert('Atenção', 'Por favor informe o seu CPF');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.toString());
      Alert.alert(
        'Ops',
        'Ocorreu um problema ao tentar consultar os dados, tente novamente!',
      );
    }
  }, []);

  const goToSecondStep = useCallback(() => {
    navigate('SecondStep');
  }, [navigate]);

  // const goToLastStep = useCallback(() => {
  //   navigate('LastStep');
  // }, [navigate]);


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Container>
        <Loading isVisible={loading} />
        <Title>Informe seu CPF</Title>
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
        <TouchableOpacity onPress={() => goToSecondStep()}>
          <LinkText>Clique aqui para informar manualmente</LinkText>
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}

export default FirstStep;
