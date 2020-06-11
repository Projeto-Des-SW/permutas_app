import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'
import FirstStep from '../pages/ServerRegister/FirstStep';
import CargoRegister from '../pages/CargoRegister';

const App = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeTabScreen() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Dashboard') {
              return (
                <MaterialCommunityIcons
                  name={
                    focused
                      ? 'home'
                      : 'home-outline'
                  }
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Interest') {
              return (
                <Ionicons
                  name={focused ? 'ios-list-box' : 'ios-list'}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: '#7c60f7',
          inactiveTintColor: 'gray',
        }}
      >
      <Tab.Screen name="Dashboard" component={Dashboard}/>
      <Tab.Screen name="Interest" component={ListInstitutions} />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {
  return (
      <App.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#7c60f7' },
        }}
      >
        <App.Screen name="CargoRegister" component={CargoRegister} />
        <App.Screen name="Home" component={HomeTabScreen} />
        <App.Screen name="ListInstitutions" component={ListInstitutions} />
        <App.Screen name="FirstStep" component={FirstStep} />
      </App.Navigator>
  );
};

export default AppRoutes;
