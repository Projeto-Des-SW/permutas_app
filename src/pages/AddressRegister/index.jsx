import React, { useRef, useCallback, useEffect, useState } from 'react';
import DropDown from '../../components/dropDown'

import {
  Image,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { Container, Title, Terms } from './styles';

import Button from '../../components/button';
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';
import logo from '../../../assets/logo.png'

import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';


import Loading from '../../components/loading'
import InfoButton from '../../components/infoButton'

import getValidationErrors from '../../utils/getValidationErros';
import apiIbge from '../../services/apiIBGE';


const AddressRegister = ({ route }) => {
  const { institutionId } = route.params;

  const navigation = useNavigation();

  const formRef = useRef(null);

  const [state, setState] = useState([]);
  const [nomeCidade, setNomeCidade] = useState("");
  const [cities, setCities] = useState([]);
  const [uf, setUf] = useState("");
  const [loading, setLoading] = useState(false);
  const [neighborhood, setNeighborhood] = useState("")

  useEffect(() => {
    async function getState() {
      try {
        setLoading(true)
        const response = await apiIbge.get('/localidades/estados');
        const stateResponse = response.data
        stateResponse.sort((a, b) => (a.sigla > b.sigla));
        setState(stateResponse);
        setLoading(false)
      } catch (err) {
        setLoading(false)
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
      setLoading(true)

      const response = await apiIbge.get(`/localidades/estados/${selectedUf.id}/municipios`);
      const cidades = response.data;
      setLoading(false)

      setCities(cidades);
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  const handleSubmit = useCallback(async (bairro, cidade, estado) => {
    try {
      setLoading(true)

      formRef.current?.setErrors({});
      const address = {
        neighborhood: bairro,
        city: cidade,
        state: estado
      };
      console.log(address)

      const schema = Yup.object().shape({
        neighborhood: Yup.string().required('Bairro obrigatório'),
      });

      await schema.validate(address, {
        abortEarly: false,
      });

      setLoading(false)
      navigation.navigate('CargoRegister', {
        institutionId: institutionId,
        address: address
      });

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
  },
    [navigation],
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
            <Image source={logo} style={{width: 190, height: 150}} />
            <View>
              <Title>Endereço da instuição</Title>
            </View>
            <Form ref={formRef} onSubmit={() => handleSubmit(neighborhood, nomeCidade, uf)}>
              <DropDown
                onChange={(value) => setUf(value)}
                valores={state.map(estado => {
                  return {
                    label: estado.sigla,
                    value: estado.sigla
                  }
                })}
                description="Estado"
                iconName="city"
              />
              <DropDown
                onChange={(value) => { setNomeCidade(value); console.log(value) }}
                valores={cities.map(cidade => {
                  return {
                    label: cidade.nome,
                    value: cidade.nome
                  }
                })}

                description="Cidade"
                iconName="city-variant"
              />
              <Input
                onChangeText={(value) => setNeighborhood(value)}
                autoCapitalize="words"
                name="neighborhood"
                placeholder="Bairro"
                icon="home"
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Adicionar
              </Button>
            </Form>
          </Container>
          <Keyboard>
              <Terms>
              <InfoButton onPress={() => console.log('alou')}>
                Termos de uso
              </InfoButton>
            </Terms>
          </Keyboard>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );

};

export default AddressRegister;

