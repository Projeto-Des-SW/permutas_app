import React, { useRef, useCallback, useEffect, useState } from 'react';

import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text
} from 'react-native';
import { Form } from '@unform/mobile';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';


import Button from '../../components/button';
import DialogButton from '../../components/dialogButton'
import Modal from '../../components/modal'
import Loading from '../../components/loading'


import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';


import { Container, Title } from './styles';



const CargoRegister = ({ route }) => {
  const { institutionId, address } = route.params;
  const navigation = useNavigation();
  const [positions, setPositions] = useState([]);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [openTitrationDialog, setOpenTitrationDialog] = useState(false);
  const [openQualificationDialog, setOpenQualificationDialog] = useState(false);
  const [loading, setLoading] = useState(false)



  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [titration, setTitration] = useState('');
  const [qualification, setQualification] = useState('');


  const toggleNameModal = () => {
    setOpenQualificationDialog(false);
    setOpenTitrationDialog(false);
    setOpenNameDialog(!openNameDialog);
  };
  const toggleTitrationModal = () => {
    setOpenQualificationDialog(false);
    setOpenNameDialog(false);
    setOpenTitrationDialog(!openTitrationDialog);
  };
  const toggleQualificationModal = () => {
    setOpenTitrationDialog(false);
    setOpenNameDialog(false);
    setOpenQualificationDialog(!openQualificationDialog);
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

  const handleSubmit = useCallback(async () => {
      try {
        const data = {
          name: name,
          titration: titration,
          qualification: qualification
        }

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do cargo obrigatório'),
          titration: Yup.string().required('Titulação obrigatória'),
          qualification: Yup.string().required('Formação obrigatória')
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        console.log(data)

        const token = await AsyncStorage.getItem('@Permutas:token');

        const response = await api.post('position', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { id } = response.data;

        const governmentEmployee = {
          position: id,
          institution: institutionId,
          address
        }

        const employeeResponse = await api.post('/government-employee', governmentEmployee, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Alert.alert('Sucesso!', 'Servidor cadastrado com sucesso.');
        navigation.navigate('Dashboard');

      } catch (error) {
        console.log(error.response.data)

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


  const getNameData = useCallback(async(page, name) => {
    console.log('alo')
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      const response = await api.get(`/position/name/?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data
    } catch (err){
      throw new Error(err)
    }

  }, [])

  const getQualificationData = useCallback(async(page, name) => {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      const response = await api.get(`/position/qualification/?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data
    } catch (err){
      throw new Error(err)
    }

  }, [])

  const getTitrationData = useCallback(async(page, name) => {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token')
      const response = await api.get(`/position/titration/?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data
    } catch (err){
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
            <Modal
              icon="bookmark"
              getDataFunction={getTitrationData}
              isVisible={openTitrationDialog}
              dataValues={positions}
              value={titration}
              setValue={setTitration}
              togleModal={toggleTitrationModal}
              inputPlaceHolder="Procure a titulação do seu cargo"
              loading={loading}
              setLoading={setLoading}
            />
            <Modal
              getDataFunction={getQualificationData}
              icon="award"
              isVisible={openQualificationDialog}
              dataValues={positions}
              value={qualification}
              setValue={setQualification}
              togleModal={toggleQualificationModal}
              inputPlaceHolder="Procure a sua formação"
              loading={loading}
              setLoading={setLoading}
            />
            <View>
              <Title>Informações do Cargo</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <DialogButton
                icon="clipboard"
                value={name}
                placeholder="Nome"
                onPress={toggleNameModal}
              />
              <DialogButton
                icon="bookmark"
                value={titration}
                placeholder="Titulação"
                onPress={toggleTitrationModal}
              />
              <DialogButton
                icon="award"
                value={qualification}
                placeholder="Formação"
                onPress={toggleQualificationModal}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && ( <Loading/>)}
    </>
  );
};

export default CargoRegister;
