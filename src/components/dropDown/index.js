import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons'


const Dropdown = ({onChange, valores, description, iconName }) => {
  const placeholder = {
    label: !!description ? description : "Escolha um estabelecimento",
    value: null,
    color: '#9EA0A4',
  };

  const Icon = () => {
    return (
      <MaterialCommunityIcons name={iconName} size={20} color="#fff"/>
    )
  }

  return (
    <RNPickerSelect
      placeholder={placeholder}
      items={valores}
      onValueChange={value => onChange(value)}
      style={pickerSelectStyles}
      Icon={Icon}
      useNativeAndroidPickerStyle={false}
      textInputProps={pickerText.text}
    />
  )
}


const pickerText = StyleSheet.create({
  text: {
    fontSize: 16
  }
})

const pickerSelectStyles = StyleSheet.create({
  iconContainer : {
    position: 'absolute',
    left: 18,
    top: 20,
  },
  inputIOS: {
    minWidth: '100%',
    height: 60,
    fontSize: 16,
    paddingLeft: 53,
    borderWidth: 2,
    backgroundColor: '#2d2d39',
    borderColor: '#ffffff',
    borderRadius: 10,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  inputAndroid: {
    minWidth: '100%',
    height: 60,
    fontSize: 16,
    paddingLeft: 53,
    borderWidth: 2,
    backgroundColor: '#2d2d39',
    borderColor: '#ffffff',
    borderRadius: 10,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
});

export default Dropdown;
