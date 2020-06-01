import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../../hooks/auth';

// import { Container } from './styles';

const Dashboard = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button title="Sair" onPress={() => signOut()} />
    </View>
  );
};

export default Dashboard;
