import React, { useRef, useCallback, useEffect, useState } from 'react';

import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Form } from '@unform/mobile';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';


import Button from '../../components/button';
import DialogButton from '../../components/dialogButton'
import Modal from '../../components/modal'
import Loading from '../../components/loading'
import Input from '../../components/input'
import InfoButton from '../../components/infoButton'
import Keyboard from '../../components/keyboard'


import logo from '../../../assets/logo.png'


import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import { Container, Title, Restrictions, Terms } from './styles';



const CargoRegister = ({ route }) => {
  const { institutionId, address } = route.params;
  const navigation = useNavigation();
  const [positions, setPositions] = useState([]);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [loading, setLoading] = useState(false)



  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');


  const toggleNameModal = () => {
    setOpenNameDialog(!openNameDialog);
  };

  useEffect(() => {
    async function getPositions() {
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.get('/position', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPositions(response.data)
    }

    getPositions()
  }, [])

  const handleSubmit = useCallback(async (description, name) => {
    try {
      setLoading(true)

      const data = {
        name: name,
        description: description,
      }
      console.log(data)
      if (!data.name || !data.description) {
        Alert.alert('Erro!', 'Preencha todos os campos.');
        setLoading(false)
        return;
      }
      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.post('/position', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { id } = response.data;

      const governmentEmployee = {
        position: id,
        institution: institutionId,
        address: address
      }

      const employeeResponse = await api.post('/government-employee', governmentEmployee, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false)
      Alert.alert('Sucesso!', 'Servidor cadastrado com sucesso.');
      navigation.navigate('Dashboard');

    } catch (error) {
      setLoading(false)
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);
        return;
      }
      console.log(error.toString());

      Alert.alert(
        'Ocorreu um problema',
        error.response.data.message,
      );
    }
  }, []);


  const getNameData = useCallback(async (page, name) => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      const response = await api.get(`/position/name/?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false)
      return response.data
    } catch (err) {
      setLoading(false)

      throw new Error(err)
    }

  }, [])

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

            <Image source={logo} style={{ width: 190, height: 150 }} />
            <View>
              <Title>Informações do cargo</Title>
            </View>
            <DialogButton
              icon="clipboard"
              value={name}
              placeholder="Nome"
              onPress={toggleNameModal}
            />

            <Restrictions>Restrições do cargo *</Restrictions>
            <Form onSubmit={() => handleSubmit(description,name)}>
              <Input
                icon="message-square"
                onChangeText={(value) => setDescription(value)}
                value={description}
                autoCapitalize="words"
                name="description"
                placeholder="Descrição do cargo"
              />
            </Form>
            <Button style={{ width: '100%' }} onPress={() => handleSubmit(description,name)}>
              Cadastrar
            </Button>
          </Container>
          <Keyboard>
            {!openNameDialog && (
              <Terms>
                <InfoButton onPress={() => console.log('aloou')}>
                  Termos de uso
                </InfoButton>
              </Terms>
            )}
          </Keyboard>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CargoRegister;
