import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Admin panel ekranlarını içe aktarın
import aa from '../AdminPanel/aa';
import HomePage from './HomePage/HomePage';
import UserDetails from './UserDetails/UserDetails';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AdminPanel = () => {
  const [doctorName, setDoctorName] = useState('');

  // Doktor bilgilerini çek
  useEffect(() => {
    const fetchDoctorData = async () => {
      const currentUser = auth.currentUser; // Giriş yapan kullanıcının kimliği
      if (currentUser) {
        try {
          const doctorRef = doc(db, 'doctors', currentUser.uid); // UID ile belgeyi alıyoruz
          const doctorDoc = await getDoc(doctorRef);
          if (doctorDoc.exists()) {
            setDoctorName(doctorDoc.data().fullname); // fullName'i çekiyoruz
          } else {
            console.log('Belge bulunamadı');
          }
        } catch (error) {
          console.error('Hata:', error);
        }
      }
    };

    fetchDoctorData();
  }, []);

  // HomeStack: HomePage ve UserDetails ekranlarını içerir
  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ title: 'Home Page' ,headerShown:false}}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{ title: 'User Details' ,headerShown:false}}
      />
    </Stack.Navigator>
  );

  return (
    <Drawer.Navigator initialRouteName="HomePage">
      {/* HomeStack Drawer içinde görünür ancak UserDetails gizli kalır */}
      <Drawer.Screen name="HomePage" component={HomeStack}  />
      <Drawer.Screen name="aa" component={aa} />
    </Drawer.Navigator>
  );
};

export default AdminPanel;
