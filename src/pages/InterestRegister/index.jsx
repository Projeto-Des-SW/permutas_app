import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Form } from '@unform/mobile';

import { Container, Title, Subtitle } from './styles';
import Button from '../../components/button';
import DropDown from '../../components/dropDown'
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';

import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';
import apiIbge from '../../services/apiIBGE';
import { useAuth } from '../../hooks/auth';

const InterestRegister = () => {
  const { user } = useAuth();
  const { navigate, goBack } = useNavigation();

  const formRef = useRef(null);
  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [region, setRegion] = useState("");
  const [institution, setInstitution] = useState("");

  useEffect(() => {
    async function getStates() {
      try {
        const response = await apiIbge.get('/localidades/estados');
        const stateResponse = response.data;
        stateResponse.sort((a, b) => (a.sigla > b.sigla));
        setStates(stateResponse);
      } catch (err) {
        console.log(err);
      }
    }
    getStates();
    getInstitutions();
  }, []);

  useEffect(() => {
    setCity('');
    setCities([]);
    getCities();
  }, [uf]);

  async function getCities() {
    const selectedUf = states.find(estado => estado.sigla === uf);

    if (!selectedUf) return;

    try {
      const response = await apiIbge.get(`/localidades/estados/${selectedUf.id}/municipios`);
      const cidades = response.data;
      setCities(cidades);
    } catch (err) {
      console.log(err);
    }
  }

  async function getInstitutions() {
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');
      const response = await api.get(`/institution`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setInstitutions(data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (data) => {
    try {
      formRef.current?.setErrors({});

      const interest = {
        institution: institution,
        neighborhood: data.neighborhood,
        city: city,
        state: uf
      };

      const schema = Yup.object().shape({
        institution: Yup.string().required('Instituição obrigatória'),
        neighborhood: Yup.string().required('Bairro obrigatório'),
        city: Yup.string()
          .required('Cidade obrigatória'),
        state: Yup.string()
          .required('Estado obrigatório'),
      });

      await schema.validate(interest, {
        abortEarly: false,
      });

      const token = await AsyncStorage.getItem('@Permutas:token');
      const response = await api.post('interest', interest, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      Alert.alert('Sucesso!', 'O interesse foi cadastrado!');
      navigate('Interesses');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }
      Alert.alert(
        'Erro no cadastro',
        ' Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
    }
  };

  const handleCancel = () => {
    goBack();
  }

  return (
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
          <Title>Cadastro de Interesse</Title>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Subtitle>Informações da instituição:</Subtitle>
            <DropDown
              onChange={(value) => setInstitution(value)}
              valores={institutions.map(item => {
                return {
                  label: item.name,
                  value: item.id
                }
              })}
              iconName="office-building-marker-outline"
              description="Selecione uma instituição"
            />
            <Subtitle>Informações do destino:</Subtitle>
            <DropDown
              onChange={(value) => setUf(value)}
              valores={states.map(estado => {
                return {
                  label: estado.sigla,
                  value: estado.sigla
                }
              })}
              iconName="map-marker-account"
              description="Selecione um estado"
            />
            <DropDown
              onChange={(value) => setCity(value)}
              valores={cities.map(cidade => {
                return {
                  label: cidade.nome,
                  value: cidade.nome
                }
              })}
              iconName="city"
              description="Selecione uma cidade"
            />
            <Input
              autoCapitalize="words"
              name="neighborhood"
              icon="home"
              placeholder="Bairro"
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Adicionar
            </Button>
            <Button onPress={handleCancel} style={{ backgroundColor: '#7b7b7b' }}>
              Cancelar
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default InterestRegister;
