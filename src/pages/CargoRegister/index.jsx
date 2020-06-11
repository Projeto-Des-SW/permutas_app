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

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import { Container, Title } from './styles';



const CargoRegister = ({ route }) => {
  //const { institutionId } = route.params;
  const navigation = useNavigation();
  const [positions, setPositions] = useState([]);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [openTitrationDialog, setOpenTitrationDialog] = useState(false);
  const [openQualificationDialog, setOpenQualificationDialog] = useState(false);


  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [titration, setTitration] = useState('');
  const [qualification, setQualification] = useState('');


  const toggleNameModal = () => {
    console.log('modal name')
    setOpenQualificationDialog(false);
    setOpenTitrationDialog(false);
    setOpenNameDialog(!openNameDialog);
  };
  const toggleTitrationModal = () => {
    console.log('modal titulação')
    setOpenQualificationDialog(false);
    setOpenNameDialog(false);
    setOpenTitrationDialog(!openTitrationDialog);
  };
  const toggleQualificationModal = () => {
    console.log('modal qualification')
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

        const token = await AsyncStorage.getItem('@Permutas:token');

        const response = await api.post('position', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { id } = response.data;

        const governmentEmployee = {
          position: id,
          institution: institutionId
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
              newPlaceHolder="Adicione o nome do seu cargo"
              isVisible={openNameDialog}
              data={positions}
              setValue={setName}
              value={name}
              togleModal={toggleNameModal}
              inputPlaceHolder="Procure o nome do seu cargo"
            />
            <Modal
              icon="bookmark"
              isVisible={openTitrationDialog}
              data={positions}
              value={titration}
              setValue={setTitration}
              togleModal={toggleTitrationModal}
              inputPlaceHolder="Procure a titulação do seu cargo"
            />
            <Modal
              icon="award"
              isVisible={openQualificationDialog}
              data={positions}
              value={qualification}
              setValue={setQualification}
              togleModal={toggleQualificationModal}
              inputPlaceHolder="Procure a sua formação"
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
    </>
  );
};

export default CargoRegister;
