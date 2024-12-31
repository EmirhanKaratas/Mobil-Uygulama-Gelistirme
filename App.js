import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login/Login';
import AdminPanel from './src/screens/AdminPanel/AdminPanel';
import SignIn from './src/screens/SignIn/SignIn';
import TestResults from './src/screens/UserPanel/TestResults/TestResults';
import UserPanel from './src/screens/UserPanel/UserPanel';
import HastaListesi from './src/screens/AdminPanel/HastaListesi/HastaListesi';
import Tahliller from './src/screens/AdminPanel/Tahliller/Tahliller';
import TahlilEkle from './src/screens/AdminPanel/TahlilEkle/TahlilEkle';
import TahlilKarsilastirma from './src/screens/AdminPanel/TahlilKarsilastirma/TahlilKarsilastirma';
import Settings from './src/screens/UserPanel/Settings/Settings';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Yönetici Paneli',headerShown: false }} />
        <Stack.Screen name="HastaListesi" component={HastaListesi} options={{ title: 'Hasta Listesi',headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'SignIn',headerShown: false}} />
        <Stack.Screen name="Tahliller" component={Tahliller} options={{ title: 'Tahlil Sonuçları',headerShown: false }} />
        <Stack.Screen name="TahlilEkle" component={TahlilEkle} options={{ title: 'Tahlil Ekle',headerShown: false }} />
        <Stack.Screen name="TahlilKarsilastirma" component={TahlilKarsilastirma} options={{ title: 'Tahlil Karşılaştırma',headerShown: false }} />
        <Stack.Screen name="UserPanel" component={UserPanel} options={{ title: 'Hasta Paneli', headerShown: false }} />
        <Stack.Screen name="TestResults" component={TestResults} options={{ title: 'Tahlil Sonuçları', headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings', headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
