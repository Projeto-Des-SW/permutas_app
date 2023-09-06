import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SingUp from '../pages/SingUp';
import ForgotPassword from '../pages/ForgotPassword';
import RedefinePassword from '../pages/RedefinePassword';

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
      <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
      <Auth.Screen name="RedefinePassword" component={RedefinePassword} />
    </Auth.Navigator>
  );
};

export default AuthRoutes;
