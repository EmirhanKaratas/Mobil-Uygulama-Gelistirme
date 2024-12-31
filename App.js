import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login/Login';
import AdminPanel from './src/screens/AdminPanel/AdminPanel';
import SignIn from './src/screens/SignIn/SignIn';
//import UserDetails from './src/screens/AdminPanel/UserDetails/UserDetails';
import TestResults from './src/screens/UserPanel/TestResults';
import UserPanel from './src/screens/UserPanel/UserPanel';
import HastaListesi from './src/screens/AdminPanel/HastaListesi';
import Tahliller from './src/screens/AdminPanel/Tahliller';
import TahlilEkle from './src/screens/AdminPanel/TahlilEkle';
import TahlilKarsilastirma from './src/screens/AdminPanel/TahlilKarsilastirma';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Yönetici Paneli',headerShown: false }} />
        <Stack.Screen name="HastaListesi" component={HastaListesi} options={{ title: 'Hasta Listesi',headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'SignIn' }} />
        <Stack.Screen name="Tahliller" component={Tahliller} options={{ title: 'Tahlil Sonuçları',headerShown: false }} />
        <Stack.Screen name="TahlilEkle" component={TahlilEkle} options={{ title: 'Tahlil Ekle',headerShown: false }} />
        <Stack.Screen name="TahlilKarsilastirma" component={TahlilKarsilastirma} options={{ title: 'Tahlil Karşılaştırma',headerShown: false }} />
        <Stack.Screen name="UserPanel" component={UserPanel} options={{ title: 'Hasta Paneli', headerShown: true }} />
        <Stack.Screen name="TestResults" component={TestResults} options={{ title: 'Tahlil Sonuçları', headerShown: true }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
