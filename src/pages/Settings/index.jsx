import React, { useRef, useCallback, useEffect, useState } from 'react';
import DropDown from '../../components/dropDown';

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

const Settings = () => {
  const { signOut, user } = useAuth();
  return (
    <Container>           
      <View style={{ width: '100%', marginTop: 30 }}>
        <Button onPress={() => signOut()}>Sair da Conta</Button>
      </View>
    </Container>
  );

};

export default Settings;
