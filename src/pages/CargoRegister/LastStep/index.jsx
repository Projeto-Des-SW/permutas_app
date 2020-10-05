import React, { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Container, Title, InfosText, LinkText } from './styles';

import Button from '../../../components/button';
import Loading from '../../../components/loading';

import api from '../../../services/api';


const LastStep = ({ route }) => {
  const {
    position,
    ocuppation,
    description,
  } = route.params;
  const [loading, setLoading] = useState(false);
  const { navigate, goBack } = useNavigation();

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.toString());
      Alert.alert(
        'Ops',
        'Ocorreu um problema ao tentar consultar os dados, tente novamente!',
      );
    }
  }, []);

  return (
    <Container>
      <Loading isVisible={loading} />
      <Title>Confirme os dados de servidor: </Title>
      <InfosText>CARGO: {position}</InfosText>
      <InfosText>FUNÇÃO: {ocuppation}</InfosText>
      {description && <InfosText>DESCRIÇÃO: {description}</InfosText>}
      <Button onPress={() => { }} style={{ marginTop: 50 }}>
        Confirmar
      </Button>
      <TouchableOpacity onPress={() => goBack()}>
        <LinkText>Voltar</LinkText>
      </TouchableOpacity>
    </Container>
  );
}

export default LastStep;
