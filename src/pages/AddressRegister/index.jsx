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

import { Container, Title, BackToSign, BackToSignText } from './styles';

import Button from '../../components/button';
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';

import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

const AddressRegister = ({ route }) => {
  const { institutionId } = route.params;

  const { navigate } = useNavigation();

  const formRef = useRef(null);

  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);

  const { signUp } = useAuth();

  const handleSignUp = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          street: Yup.string().required('Rua obrigatória'),
          city: Yup.string()
            .required('Cidade obrigatória'),
          state: Yup.string()
            .required('Estado obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        

        //const response = await api.post('/address',data);

        //console.log(response.data);
        console.log(data);

        //await signUp(response.data.session);

        //navigate('FirstStep');
        navigate('CargoRegister',{
          institutionId: institutionId
        });

      } catch (err) {
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
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <View>
              <Title>Endereço da instuição</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="street"
                placeholder="Rua"
                returnKeyType="next"
                onSubmitEditing={() => {
                  cityInputRef.current?.focus();
                }}
              />

              <Input
                ref={cityInputRef}
                name="city"
                placeholder="Cidade"
                returnKeyType="next"
                onSubmitEditing={() => {
                  stateInputRef.current?.focus();
                }}
              />
              <Input
                ref={stateInputRef}
                name="state"
                placeholder="Estado"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Adicionar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <Keyboard>
        <BackToSign onPress={() => navigate('ListInstitutions')}>
          <Feather name="arrow-left" size={20} color="#7c60f7" />
          <BackToSignText> Voltar para seleção da instituição </BackToSignText>
        </BackToSign>
      </Keyboard>
    </>
  );

};

export default AddressRegister;