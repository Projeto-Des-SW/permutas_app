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
    backgroundColor: '#FFF',
    borderColor: '#ddd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    minWidth: '100%',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    backgroundColor: '#FFF',
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
});

export default Dropdown;