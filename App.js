import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login/Login';
import AdminPanel from './src/screens/AdminPanel/AdminPanel';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AdminPanel">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Yönetici Paneli' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
