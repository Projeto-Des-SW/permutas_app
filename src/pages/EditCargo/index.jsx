import React, { useRef, useCallback, useEffect, useState } from 'react';

import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import Button from '../../components/button';
import DialogButton from '../../components/dialogButton';
import Modal from '../../components/modal';
import Loading from '../../components/loading';
import Keyboard from '../../components/keyboard';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import { Container, Title, BackToProfile, BackToProfileText } from './styles';


const CargoRegister = () => {
  const navigation = useNavigation();
  const [positions, setPositions] = useState([]);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null);
  const [name, setName] = useState('');

  const toggleNameModal = () => {
    setOpenNameDialog(!openNameDialog);
  };

  useEffect(() => {
    async function getPositions() {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.get('/government-employee/employee', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPositions(response.data.position);
      setName(response.data.position.name);
    }

    getPositions()
  }, [navigation])

  const handleSaveEdit = async () => {
      try {
        setLoading(true);
        const data = {
          name: name,
          id_position: positions.id,
        };

        if(!data.name || !data.id_position) {
          Alert.alert('Erro!', 'Preencha todos os campos.');
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('@Permutas:token');

        await api.put('/position', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setLoading(false);
        Alert.alert('Sucesso!', 'Cargo atualizado');
        navigation.navigate('Perfil');

      } catch (error) {
        
        setLoading(false)
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
          return;
        }
        console.log(error.response.data);

        Alert.alert(
          'Ocorreu um problema',
          error.response.data.message,
        );
      }
    };


  const getNameData = useCallback(async(page, name) => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');
      const response = await api.get(`/position/name/?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);
      return response.data;
    } catch (err){
      setLoading(false);
      throw new Error(err)
    }
  }, []);

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
            <Modal
              icon="clipboard"
              getDataFunction={getNameData}
              newPlaceHolder="Adicione o nome do seu cargo"
              isVisible={openNameDialog}
              dataValues={positions}
              setValue={setName}
              value={name}
              togleModal={toggleNameModal}
              inputPlaceHolder="Procure o nome do seu cargo"
              loading={loading}
              setLoading={setLoading}
            />
            <View>
              <Title>Alterar Cargo</Title>
            </View>
            <DialogButton
                icon="clipboard"
                value={name}
                placeholder="Nome"
                onPress={toggleNameModal}
              />
              <Button style={{width: '100%'}} onPress={() => handleSaveEdit()}>
                Salvar
              </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <Keyboard>
        <BackToProfile onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
          <BackToProfileText> Voltar para o perfil </BackToProfileText>
        </BackToProfile>
      </Keyboard>
    </>
  );
};

export default CargoRegister;
