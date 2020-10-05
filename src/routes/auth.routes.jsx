import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SingUp from '../pages/SingUp';
import FirstStep from '../pages/CargoRegister/FirstStep';
import SecondStep from '../pages/CargoRegister/SecondStep';
import LastStep from '../pages/CargoRegister/LastStep';

const Auth = createStackNavigator();

const AuthRoutes = () => {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1c1d29' },
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SingUp} />
      <Auth.Screen name="FirstStep" component={FirstStep} />
      <Auth.Screen name="SecondStep" component={SecondStep} />
      <Auth.Screen name="LastStep" component={LastStep} />
    </Auth.Navigator>
  );
};

export default AuthRoutes;
