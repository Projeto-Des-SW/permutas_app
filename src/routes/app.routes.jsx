import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'
// import FirstStep from '../pages/ServerRegister/FirstStep';
import CargoRegister from '../pages/CargoRegister';
import AddressRegister from '../pages/AddressRegister';
import InterestRegister from '../pages/InterestRegister';
import InterestList from '../pages/InterestList';
import Settings from '../pages/Settings';

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
            else if (route.name === 'Interesses') {
              return (
                <Ionicons
                  name={focused ? 'ios-list-box' : 'ios-list'}
                  size={size}
                  color={color}
                />
              );
            }
            else if (route.name === 'Configurações') {
              return (
                <MaterialCommunityIcons
                  name={
                    focused
                      ? 'settings'
                      : 'settings-outline'
                  }
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: '#e32245',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: '#1c1d29',
            //borderTopWidth:2,
            //borderColor: '#000',
          }, 
        }}
      >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Interesses" component={InterestList} />
      <Tab.Screen name="Configurações" component={Settings} />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {
  return (
      <App.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1c1d29' },
        }}
      >
        <App.Screen name="Home" component={HomeTabScreen} />
        <App.Screen name="ListInstitutions" component={ListInstitutions} />
        <App.Screen name="AddressRegister" component={AddressRegister} />
        <App.Screen name="CargoRegister" component={CargoRegister} />
        <App.Screen name="InterestRegister" component={InterestRegister} />
      </App.Navigator>
  );
};

export default AppRoutes;
