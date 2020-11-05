import React, { useRef, useCallback, useEffect, useState } from 'react';

import DropDown from '../../components/dropDown'
import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';


import { Container, Title, BackToProfile, BackToProfileText } from './styles';
import Button from '../../components/button';
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';

import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';

import Loading from '../../components/loading';

import getValidationErrors from '../../utils/getValidationErros';
import apiIbge from '../../services/apiIBGE';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';


const EditAddress = () => {

  const navigation = useNavigation();

  const formRef = useRef(null);

  const [state, setState] = useState([]);
  const [nomeCidade, setNomeCidade] = useState("");
  const [cities, setCities] = useState([]);
  const [uf, setUf] = useState("");
  const [loading, setLoading] = useState(false);
  const [neighborhood, setNeighborhood] = useState("");
  const [idAddress, setIdAddress] = useState("");

  useEffect(() => {
    getState();
  }, []);

  useEffect(() => {
    setCities([])
    getCities();
  }, [uf]);


  async function getState() {
    try {
      setLoading(true);
      const response = await apiIbge.get('/localidades/estados');
      const stateResponse = response.data;
      stateResponse.sort((a, b) => (a.sigla > b.sigla));
      stateResponse.map(state => state.nome = state.nome.toUpperCase());
      setState(stateResponse);
      setLoading(false);
      await getAddress();
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  async function getCities() {
    const selectedUf = state.find(estado => estado.nome === uf);

    if (!selectedUf) return;

    try {
      setLoading(true);
      const response = await apiIbge.get(`/localidades/estados/${selectedUf.id}/municipios`);
      const cidades = response.data;
      setCities(cidades);
      setLoading(false);
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  async function getAddress() {
    const token = await AsyncStorage.getItem('@Permutas:token');
    const response = await api.get('/government-employee/employee', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUf(response.data.institutionAddress.state);
    setNomeCidade(response.data.institutionAddress.city);
    setNeighborhood(response.data.institutionAddress.neighborhood);
    setIdAddress(response.data.institutionAddress.id);
  }

  const handleSubmit = async (bairro, cidade, estado) => {
    try {
      setLoading(true)

      formRef.current?.setErrors({});
      const address = {
        neighborhood: bairro,
        city: cidade,
        state: estado,
        id_address: idAddress,
      };

      const schema = Yup.object().shape({});

      await schema.validate(address, {
        abortEarly: false,
      });

      const token = await AsyncStorage.getItem('@Permutas:token');

      await api.put('/address', address, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);

      Alert.alert('Sucesso!', 'Endereço atualizado');
      navigation.navigate('Perfil');
    } catch (err) {
      setLoading(false)

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
  };

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
            <View>
              <Title>Editar o endereço da instuição</Title>
            </View>
            <Form ref={formRef} onSubmit={() => handleSubmit(neighborhood, nomeCidade, uf)}>
              <DropDown
                onChange={(value) => setUf(value)}
                valores={state.map(estado => {
                  return {
                    label: estado.nome,
                    value: estado.nome
                  }
                })}
                description="Estado"
                iconName="city"
                valueIni={uf}
              />
              <DropDown
                onChange={(value) => setNomeCidade(value)}
                valores={cities.map(cidade => {
                  return {
                    label: cidade.nome,
                    value: cidade.nome
                  }
                })}
                description="Cidade"
                iconName="city-variant"
                valueIni={nomeCidade}
              />
              <Input
                onChangeText={(value) => setNeighborhood(value)}
                autoCapitalize="words"
                name="neighborhood"
                placeholder="Bairro"
                icon="home"
                value={neighborhood}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar
            </Button>
            </Form>
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

export default EditAddress;
