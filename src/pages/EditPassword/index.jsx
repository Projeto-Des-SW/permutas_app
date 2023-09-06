import React, { useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';
import logo from '../../../assets/logo-2.png';

import { Container, Title, BackToProfile, BackToProfileText } from './styles';

const EditPassword = () => {
  const formRef = useRef(null);
  const oldPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { navigate, goBack } = useNavigation();

  const handleSaveEdit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          oldPassword: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Digite pelo menos 6 caracteres'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'Digite pelo menos 6 caracteres'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = await AsyncStorage.getItem('@Permutas:token');
        await api.put('/users/password', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);

        Alert.alert('Dados atualizados com sucesso!');

        goBack();
      } catch (err) {
        setLoading(false);
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
                marginTop: 100,
              }}
            />
            <View>
              <Title>Alterar senha</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSaveEdit}>
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="oldPassword"
                icon="lock"
                placeholder="Senha antiga"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  newPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={newPasswordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <Keyboard>
        <BackToProfile onPress={() => goBack()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
          <BackToProfileText> Voltar para o perfil </BackToProfileText>
        </BackToProfile>
      </Keyboard>
    </>
  );
};

export default EditPassword;
