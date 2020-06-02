import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'
import FirstStep from '../pages/ServerRegister/FirstStep';
import CargoRegister from '../pages/CargoRegister';

const App = createStackNavigator();

const AppRoutes = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#7c60f7' },
      }}
    >

      <App.Screen name="Dashboard" component={Dashboard} />
      <App.Screen name="ListInstitutions" component={ListInstitutions} />
      <App.Screen name="FirstStep" component={FirstStep} />
      <App.Screen name="CargoRegister" component={CargoRegister} />
    </App.Navigator>
  );
};

export default AppRoutes;
