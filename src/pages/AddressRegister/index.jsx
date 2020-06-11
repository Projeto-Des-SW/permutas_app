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

import { Container, Title, BackToSign, BackToSignText, PickerSelectStyles } from './styles';

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
import apiIbge from '../../services/apiIBGE';

const AddressRegister = ({ route }) => {
  const { institutionId } = route.params;

  const { navigate } = useNavigation();

  const formRef = useRef(null);

  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const { signUp } = useAuth();

  const [state, setState] = useState([]);
  const [nomeCidade, setNomeCidade] = useState("");
  const [cities, setCities] = useState([]);
  const [uf, setUf] = useState("");

  useEffect(() => {
    async function getState(){
      try {
        const response = await apiIbge.get('/localidades/estados');
        const stateResponse = response.data
        stateResponse.sort((a, b) => (a.sigla > b.sigla));
        setState(stateResponse);
      } catch (err) {
        console.log(err);
      }
    }
    getState();
  }, []);

  useEffect(() => {
    setCities([])
    setNomeCidade("")
    getCities()
  }, [uf]);

  async function getCities() {
    const selectedUf = state.find(estado => estado.sigla === uf);

    if (!selectedUf) {
      return;
    }
    try {
      const response = await apiIbge.get(`/localidades/estados/${selectedUf.id}/municipios`);
      const cidades = response.data;

      setCities(cidades);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});
        const address = {
          neighborhood: data.neighborhood,
          city: nomeCidade,
          state: uf
        };

        const schema = Yup.object().shape({
          neighborhood: Yup.string().required('Bairro obrigatório'),
          city: Yup.string()
            .required('Cidade obrigatória'),
          state: Yup.string()
            .required('Estado obrigatório'),
        });

        await schema.validate(address, {
          abortEarly: false,
        });

        navigate('CargoRegister',{
          institutionId: institutionId,
          address: address
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
            <Form ref={formRef} onSubmit={handleSubmit}>
              <DropDown
                onChange={(value) => setUf(value)}
                valores={state.map(estado => {
                  return {
                    label: estado.sigla,
                    value: estado.sigla
                  }
                })}
                description="Selecione um estado"
              />
              <DropDown
                onChange={(value) => setNomeCidade(value)}
                valores={cities.map(cidade => {
                  return {
                    label: cidade.nome,
                    value: cidade.nome
                  }
                })}

                description="Selecione uma cidade"
              />
               <Input
                autoCapitalize="words"
                name="neighborhood"
                placeholder="Bairro"
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
