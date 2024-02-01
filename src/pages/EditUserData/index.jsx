import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as Yup from 'yup';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import AsyncStorage from '@react-native-community/async-storage';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';
import Keyboard from '../../components/keyboard';
import Loading from '../../components/loading';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { Container, Title, BackToProfile, BackToProfileText } from './styles';
import logo from '../../../assets/logo-2.png';

import * as S from './styles';
import ChangeAvatarModal from '../../components/changeAvatarModal';

const EditUserData = () => {
  const formRef = useRef(null);
  const nomeInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { goBack } = useNavigation();
  const [avatarFile, setAvatarFile] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { name, email, avatar } = response.data;

      formRef.current.setData({ name, email });

      if (!String(avatar).includes('null')) {
        setAvatarFile(avatar.replaceAll("'", ''));
      }
    }
    getUserData();
  }, []);

  async function handleSaveEdit(data) {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('E-mail obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const editFormData = new FormData();

      if (avatarFile) {
        const fileName = avatarFile.split('/').pop();
        const fileType = fileName.split('.').pop();

        editFormData.append('avatar', {
          uri: avatarFile,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      editFormData.append('name', data.name);
      editFormData.append('email', data.email);

      const token = await AsyncStorage.getItem('@Permutas:token');
      await api.put('/users', editFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
        if (errors.name || errors.email) {
          Alert.alert(
            'Erro ao alterar dados',
            'Ocorreu um erro ao alterar os dados. Verifique as informações e tente novamente.',
          );
        }
        return;
      }
      console.log(err.toString());
      Alert.alert(
        'Erro no cadastro',
        ' Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Loading isVisible={loading} />
        <ChangeAvatarModal
          setAvatarFile={setAvatarFile}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <S.HeaderContainer>
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
              <Title>Alterar Dados</Title>
              {avatarFile ? (
                <S.AvatarContainer>
                  <S.AvatarImg
                    source={{
                      uri: `${avatarFile}`,
                    }}
                  />
                  <S.OpenCameraButton
                    underlayColor="#283040"
                    onPress={() => setIsOpen(true)}
                  >
                    <FontAwesome name={'camera'} size={30} color="white" />
                  </S.OpenCameraButton>
                </S.AvatarContainer>
              ) : (
                <S.AvatarContainer>
                  <FontAwesome name={'user-circle'} size={200} color="white" />
                  <S.OpenCameraButton
                    underlayColor="#283040"
                    onPress={() => setIsOpen(true)}
                  >
                    <FontAwesome name={'camera'} size={30} color="white" />
                  </S.OpenCameraButton>
                </S.AvatarContainer>
              )}
            </S.HeaderContainer>
            <Form ref={formRef} onSubmit={handleSaveEdit}>
              <Input
                ref={nomeInputRef}
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
                  oldPasswordInputRef.current?.focus();
                }}
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

export default EditUserData;
