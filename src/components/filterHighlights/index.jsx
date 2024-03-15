import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import apiIbge from '../../services/apiIBGE';

import DropDown from '../dropDown';
import ModalInstitution from '../modal';
import DialogButton from '../dialogButton';
import Loading from '../loading';
import Keyboard from '../keyboard';

import api from '../../services/api';

import {
  ModalView,
  Modal,
  ModalHeader,
  HeaderText,
  ClearAllFilter,
  Exit,
  FilterBlock,
  FilterBlockTittle,
  FilterBlockBody,
  FilterBlockHeader,
  ClearFilter,
  ApplyFilterButton,
  ApllyFilterText,
} from './styles';

const filterHighlights = ({ isVisible, toggleModal, filterFunction }) => {
  const [state, setState] = useState([]);
  const [nomeCidade, setNomeCidade] = useState('');
  const [cities, setCities] = useState([]);
  const [uf, setUf] = useState('');
  const [region, setRegion] = useState([]);
  const [nomeRegiao, setNomeRegiao] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearLocation, setClearLocation] = useState(false);
  const [institution, setInstitution] = useState('');
  const [openInstitutionDialog, setOpenInstitutionDialog] = useState(false);

  useEffect(() => {
    async function getState() {
      try {
        setLoading(true);
        const response = await apiIbge.get('/localidades/estados');
        const stateResponse = response.data;
        stateResponse.sort((a, b) => a.sigla > b.sigla);
        setState(stateResponse);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
    getState();
  }, []);

  useEffect(() => {
    async function getState() {
      try {
        setLoading(true);
        const response = await apiIbge.get('/localidades/regioes');
        const regionResponse = response?.data;
        regionResponse.sort((a, b) => a.sigla > b.sigla);
        setRegion(regionResponse);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
    getState();
  }, []);

  useEffect(() => {
    if (uf) {
      setClearLocation(true);
      getCities();
    } else {
      setClearLocation(false);
    }
    setCities([]);
    setNomeCidade('');
  }, [uf]);

  async function getCities() {
    const selectedUf = state.find((estado) => estado.sigla === uf);

    if (!selectedUf) {
      return;
    }
    try {
      setLoading(true);

      const response = await apiIbge.get(
        `/localidades/estados/${selectedUf.id}/municipios`,
      );
      const cidades = response.data;
      setLoading(false);

      setCities(cidades);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  function handleClearAll() {
    handleClearLocation();
    handleClearInstitution();
  }

  function handleClearLocation() {
    setUf(null);
    setNomeCidade(null);
    setCities([]);
    setNomeRegiao(null);
  }

  function handleClearInstitution() {
    setInstitution('');
  }

  const getInstitutionsData = async (page, name) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@Permutas:token');
      const response = await api.get(`/institution?page=${page}&name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);

      throw new Error(err);
    }
  };

  async function handleFilter() {
    toggleModal();
    await filterFunction(uf !== null ? uf : '', nomeCidade !== null ? nomeCidade : '', institution, nomeRegiao !== null ? nomeRegiao : '');
  }

  return (
    <>
      <Loading isVisible={loading} />
      <Modal
        backdropOpacity={0.4}
        onBackdropPress={() => toggleModal()}
        isVisible={isVisible}
      >
        <ModalView>
          <ModalInstitution
            icon="clipboard"
            getDataFunction={getInstitutionsData}
            isVisible={openInstitutionDialog}
            setValue={setInstitution}
            value={institution}
            togleModal={() => setOpenInstitutionDialog(!openInstitutionDialog)}
            inputPlaceHolder="Procure o nome da sua instituição"
            loading={loading}
            setLoading={setLoading}
          />
          <ModalHeader>
            <Exit>
              <TouchableOpacity onPress={() => toggleModal()}>
                <Feather name="x" size={35} color="#fff" />
              </TouchableOpacity>
              <HeaderText>Filtros</HeaderText>
            </Exit>
            <TouchableOpacity onPress={() => handleClearAll()}>
              <ClearAllFilter>LIMPAR TODOS</ClearAllFilter>
            </TouchableOpacity>
          </ModalHeader>
          <Keyboard>
            <FilterBlock>
              <FilterBlockHeader>
                <FilterBlockTittle>Local</FilterBlockTittle>
                {clearLocation && uf && (
                  <TouchableOpacity onPress={() => handleClearLocation()}>
                    <ClearFilter>Limpar</ClearFilter>
                  </TouchableOpacity>
                )}
              </FilterBlockHeader>

              <FilterBlockBody>
                {/* <DropDown
                  onChange={(value) => setUf(value)}
                  valores={state.map((estado) => {
                    return {
                      label: estado.sigla,
                      value: estado.sigla,
                    };
                  })}
                  valueIni={uf}
                  description="Cargo"
                  iconName="account-cog"
                />*/}
                <DropDown
                  onChange={(value) => setNomeRegiao(value)}
                  valores={region.map((reg) => {
                    return {
                      label: reg.nome,
                      value: reg.sigla,
                    };
                  })}
                  valueIni={nomeRegiao}
                  description="Região"
                  iconName="map-marker-radius-outline"
                />
                <DropDown
                  onChange={(value) => setUf(value)}
                  valores={state.map((estado) => {
                    return {
                      label: estado.sigla,
                      value: estado.sigla,
                    };
                  })}
                  valueIni={uf}
                  description="Estado"
                  iconName="city"
                />
                <DropDown
                  onChange={(value) => {
                    setNomeCidade(value);
                    console.log(value);
                  }}
                  valores={cities.map((cidade) => {
                    return {
                      label: cidade.nome,
                      value: cidade.nome,
                    };
                  })}
                  valueIni={nomeCidade}
                  description="Cidade"
                  iconName="city-variant"
                />
              </FilterBlockBody>
            </FilterBlock>

            <FilterBlock>
              <FilterBlockBody>
                <FilterBlockHeader>
                  <FilterBlockTittle>Instituição</FilterBlockTittle>
                  {!!institution && (
                    <TouchableOpacity onPress={() => handleClearInstitution()}>
                      <ClearFilter>Limpar</ClearFilter>
                    </TouchableOpacity>
                  )}
                </FilterBlockHeader>
                <DialogButton
                  icon="clipboard"
                  value={institution}
                  placeholder="Instituição"
                  onPress={() =>
                    setOpenInstitutionDialog(!openInstitutionDialog)
                  }
                />
              </FilterBlockBody>
            </FilterBlock>
            <ApplyFilterButton onPress={handleFilter}>
              <ApllyFilterText>Aplicar</ApllyFilterText>
            </ApplyFilterButton>
          </Keyboard>
        </ModalView>
      </Modal>
    </>
  );
};

export default filterHighlights;
