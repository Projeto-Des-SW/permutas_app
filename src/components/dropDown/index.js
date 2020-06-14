import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';


const Dropdown = ({onChange, valores, description }) => {
  const placeholder = {
    label: !!description ? description : "Escolha um estabelecimento",
    value: null,
    color: '#9EA0A4',
  };
  return (
    <RNPickerSelect
      placeholder={placeholder}
      items={valores}
      onValueChange={value => onChange(value)}
      style={pickerSelectStyles}
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
  inputIOS: {
    minWidth: '100%',
    height: 60,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#2d2d39',
    borderColor: '#ffffff',
    borderRadius: 10,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  inputAndroid: {
    minWidth: '100%',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    backgroundColor: '#2d2d39',
    borderColor: '#ffffff',
    borderRadius: 10,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
});

export default Dropdown;