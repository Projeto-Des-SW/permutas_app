import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'
import FirstStep from '../pages/ServerRegister/FirstStep';
import CargoRegister from '../pages/CargoRegister';
import AddressRegister from '../pages/AddressRegister';
import InterestRegister from '../pages/InterestRegister';

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
            }
            else if (route.name === 'Novo Interesse') {
              return (
                <Ionicons
                  name={focused ? 'ios-add-circle' : 'ios-add-circle-outline'}
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
      <Tab.Screen name="Novo Interesse" component={InterestRegister} />
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
        <App.Screen name="Home" component={HomeTabScreen} />
        <App.Screen name="ListInstitutions" component={ListInstitutions} />
        {/* <App.Screen name="FirstStep" component={FirstStep} /> */}
        <App.Screen name="AddressRegister" component={AddressRegister} />
        <App.Screen name="CargoRegister" component={CargoRegister} />   
      </App.Navigator>
  );
};

export default AppRoutes;
