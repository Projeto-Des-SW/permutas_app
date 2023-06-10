import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import Dashboard from '../pages/Dashboard';
import ListInstitutions from '../pages/ListInstitutions'
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

const App = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeTabScreen() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#e32245",
          abBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              "display": "flex"
            },
            null
          ],
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
            else if (route.name === 'Perfil') {
              return (
                <FontAwesome
                  name={focused ? 'user-circle' : 'user-circle-o'}
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
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {
  const [isGovernment, setIsGovernment] = useState(false);

  useEffect(() => {
    async function check() {
      const result = await checkGovernmentEmployee();
      setIsGovernment(result);
    }
    check();
  }, []);

  return (
      <App.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1c1d29' },
        }}
      >
        {
          !isGovernment &&
          <>
            <App.Screen name="FirstStep" component={FirstStep} />
            <App.Screen name="SecondStep" component={SecondStep} />
          </>
        }
        <App.Screen name="Home" component={HomeTabScreen} />
        <App.Screen name="ListInstitutions" component={ListInstitutions} />
        {/* <App.Screen name="AddressRegister" component={AddressRegister} />
        <App.Screen name="CargoRegister" component={CargoRegister} /> */}
        <App.Screen name="InterestRegister" component={InterestRegister} />
        <App.Screen name="Profile" component={Profile} />
        <App.Screen name="EditUserData" component={EditUserData}/>
        <App.Screen name="EditAddress" component={EditAddress}/>
        <App.Screen name="EditCargo" component={EditCargo}/>
        <App.Screen name="EditPassword" component={EditPassword}/>
      </App.Navigator>
  );
};

export default AppRoutes;
