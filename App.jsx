import 'react-native-gesture-handler';


import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from './src/hooks';

import Routes from './src/routes';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#7c60f7" />
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: '#7c60f7' }}>
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
