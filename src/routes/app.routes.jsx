import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions';
// import CargoRegister from '../pages/CargoRegister';
// import AddressRegister from '../pages/AddressRegister';
import InterestRegister from '../pages/InterestRegister';
import InterestList from '../pages/InterestList';
import Profile from '../pages/Profile';
import EditUserData from '../pages/EditUserData';
import EditAddress from '../pages/EditAddress';
import EditCargo from '../pages/EditCargo';
import EditPassword from '../pages/EditPassword';
import FirstStep from '../pages/CargoRegister/FirstStep';
import SecondStep from '../pages/CargoRegister/SecondStep';

import checkGovernmentEmployee from '../utils/checkGovernmentEmployee';
import { Chats } from '../pages/Chats';
import { ChatDetails } from '../pages/Chats/ChatDetails';
import { useAuth } from '../hooks/auth';

const App = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#e32245',
        abBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'DASHBOARD') {
            return (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'INTERESSES') {
            return (
              <Ionicons
                name={focused ? 'list' : 'ios-list'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'PERFIL') {
            return (
              <FontAwesome
                name={focused ? 'user-circle' : 'user-circle-o'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'CHATS') {
            return <FontAwesome name={'comments'} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="DASHBOARD" component={Dashboard} />
      <Tab.Screen name="INTERESSES" component={InterestList} />
      <Tab.Screen name="CHATS" component={Chats} />
      <Tab.Screen name="PERFIL" component={Profile} />
    </Tab.Navigator>
  );
}

const AppRoutes = () => {
  const { data } = useAuth();
  const [isGovernment, setIsGovernment] = useState();

  useEffect(() => {
    async function check() {
      const result = await checkGovernmentEmployee();
      setIsGovernment(result);
    }
    check();
  }, [data]);

  if (isGovernment === undefined) {
    return <></>;
  }

  if (!isGovernment) {
    return (
      <App.Navigator
        screenOptions={{
          headerShown: true,
          cardStyle: { backgroundColor: '#1c1d29' },
        }}
      >
        <App.Screen
          options={() => ({
            headerShown: false,
          })}
          name="FirstStep"
          component={FirstStep}
        />
        <App.Screen
          options={() => ({
            headerShown: false,
          })}
          name="SecondStep"
          component={SecondStep}
        />
      </App.Navigator>
    );
  }

  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1c1d29' },
      }}
    >
      <App.Screen name="Home" component={HomeTabScreen} />
      <App.Screen name="ListInstitutions" component={ListInstitutions} />
      {/* <App.Screen name="AddressRegister" component={AddressRegister} />
        <App.Screen name="CargoRegister" component={CargoRegister} /> */}
      <App.Screen name="InterestRegister" component={InterestRegister} />
      <App.Screen name="Profile" component={Profile} />
      <App.Screen name="EditUserData" component={EditUserData} />
      <App.Screen name="EditAddress" component={EditAddress} />
      <App.Screen name="EditCargo" component={EditCargo} />
      <App.Screen name="EditPassword" component={EditPassword} />
      <App.Screen
        options={() => ({
          headerShown: true,
          headerTitle: 'Chat',
        })}
        name="ChatDetails"
        component={ChatDetails}
      />
    </App.Navigator>
  );
};

export default AppRoutes;
