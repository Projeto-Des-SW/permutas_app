import React, { useRef, useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';

import { Container, Title, HelperText } from './styles';

import Input from '../../../components/input';
import Button from '../../../components/button';
import Loading from '../../../components/loading';

const SecondStep = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const handleConfirm = useCallback(async (data) => {
    try {
      setLoading(true);
      setLoading(false);
      navigate('LastStep', data);
    } catch (error) {
      console.log(error.toString());
      Alert.alert(
        'Ops',
        'Ocorreu um problema ao tentar consultar os dados, tente novamente!',
      );
    }
  }, []);


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Container>
        <Loading isVisible={loading} />
        <Title>Informe seus dados</Title>
        <Form
          ref={formRef}
          onSubmit={handleConfirm}
          style={{ marginTop: 20 }}
        >
          <Input
            name="position"
            icon="clipboard"
            placeholder="Cargo"
            returnKeyType="next"
          />
          <Input
            name="ocuppation"
            icon="briefcase"
            placeholder="Função"
            returnKeyType="next"
          />
          <Input
            name="description"
            icon="clipboard"
            placeholder="Descrição (opcional)"
            returnKeyType="done"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />
          <Button
            onPress={() => formRef.current?.submitForm()}
            style={{ marginTop: 20 }}
          >
            Confirmar
        </Button>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}

export default SecondStep;
