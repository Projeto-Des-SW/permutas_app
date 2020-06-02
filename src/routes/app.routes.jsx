import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'

const App = createStackNavigator();

const AppRoutes = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#7c60f7' },
      }}
    >
      <App.Screen name="ListInstitutions" component={ListInstitutions} />
      <App.Screen name="Dashboard" component={Dashboard} />
    </App.Navigator>
  );
};

export default AppRoutes;
