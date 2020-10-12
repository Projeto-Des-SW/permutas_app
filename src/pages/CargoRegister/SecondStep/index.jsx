import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Title, HelperText, LinkText } from './styles';

import Input from '../../../components/input';
import Button from '../../../components/button';
import Loading from '../../../components/loading';
import DropDown from '../../../components/dropDown';

import apiIbge from '../../../services/apiIBGE';
import api from '../../../services/api';

const SecondStep = ({ route }) => {
  const {
    name,
    position,
    institution,
    role,
    allocation,
    state,
  } = route.params;

  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);

      const governmentEmployee = {
        position,
        institution,
        state,
        city,
        name,
        allocation,
        role,
      };

      const token = await AsyncStorage.getItem('@Permutas:token');

      const response = await api.post('government-employee', governmentEmployee, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setLoading(false);

      Alert.alert('Sucesso', 'Seu cadastro foi realizado!');
      navigate('Home');
    } catch (error) {
      setLoading(false);
      console.log(error.toString());
      Alert.alert(
        'Ops',
        'Ocorreu um problema, tente novamente!',
      );
    }
  }, [city]);

  useEffect(() => {
    async function getCities() {
      try {
        setLoading(true);
        const response = await apiIbge.get('/localidades/estados');
        const stateResponse = response.data;
        const uf = stateResponse.find(uf => uf.nome.toUpperCase() === state.toUpperCase());
        if (uf) {
          const response = await apiIbge.get(`/localidades/estados/${uf.id}/municipios`);
          setCities(response.data);
        };
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
        Alert.alert('Houve um problema ao obter cidades');
      }
    }
    getCities();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Container>
        <Loading isVisible={loading} />
        <Title>Confirme seus dados</Title>
        <Form
          ref={formRef}
          onSubmit={handleConfirm}
          style={{ marginTop: 20 }}
        >
          <Input
            autoCapitalize="words"
            name="name"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            editable={false}
            value={name}
          />
          <Input
            name="position"
            icon="clipboard"
            placeholder="Cargo"
            returnKeyType="next"
            editable={false}
            value={position}
          />
          <Input
            name="role"
            icon="briefcase"
            placeholder="Função"
            returnKeyType="next"
            editable={false}
            value={role}
          />
          <Input
            name="institution"
            icon="book-open"
            placeholder="Instituição"
            returnKeyType="done"
            editable={false}
            value={institution}
          />
          <Input
            name="allocation"
            icon="bookmark"
            placeholder="Alocação"
            returnKeyType="done"
            editable={false}
            value={allocation}
          />
          <Input
            name="state"
            icon="home"
            placeholder="Estado"
            returnKeyType="done"
            editable={false}
            value={state}
          />
          <HelperText>Informe a cidade:</HelperText>
          <DropDown
            onChange={(value) => setCity(value)}
            valores={cities.map(cidade => {
              return {
                label: cidade.nome,
                value: cidade.nome
              }
            })}
            description="Cidade"
            iconName="city-variant"
          />
          <Button
            onPress={() => formRef.current?.submitForm()}
            style={{ marginTop: 20 }}
          >
            Confirmar
        </Button>
        </Form>
        <TouchableOpacity onPress={() => navigate('FirstStep')}>
          <LinkText>Voltar</LinkText>
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}

export default SecondStep;
