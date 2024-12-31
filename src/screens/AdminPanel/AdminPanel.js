import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { DoctorProvider, useDoctor } from '../../context/DoctorContext';
import styles from './styles';

import HastaListesi from './HastaListesi/HastaListesi';
import TahlilEkle from './TahlilEkle/TahlilEkle';
import HastaEkle from './HastaEkle/HastaEkle';
import Tahliller from './Tahliller/Tahliller';
import KilavuzEkle from './KilavuzEkle/KilavuzEkle';
import Settings from './Settings/Settings';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function AdminPanel() {
  return (
    <DoctorProvider>
      <AdminPanelContent />
    </DoctorProvider>
  );
}

function AdminPanelContent() {
  const navigation = useNavigation();
  const { 
    doctorName, setDoctorName, 
    doctorEmail, setDoctorEmail, 
    doctorGender, setDoctorGender 
  } = useDoctor();

  React.useEffect(() => {
    const fetchDoctorData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setDoctorEmail(currentUser.email);

        try {
          const doctorRef = doc(db, 'doctors', currentUser.uid);
          const doctorDoc = await getDoc(doctorRef);
          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data();
            setDoctorName(doctorData.fullname);
            setDoctorGender(doctorData.cinsiyet);
          } else {
            console.log('Doktor bulunamadı');
          }
        } catch (error) {
          console.error('Hata:', error);
        }
      }
    };

    fetchDoctorData();
  }, [setDoctorEmail, setDoctorName, setDoctorGender]);

  const getProfileImage = () => {
    const gender = (doctorGender || '').toLowerCase().trim();
    switch (gender) {
      case 'erkek':
        return require('../../../assets/maleprofile.png');
      case 'kadın':
        return require('../../../assets/femaleprofile.png');
      default:
        return require('../../../assets/default.png');
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('Çıkış yapıldı.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Çıkış yapılırken bir hata oluştu:', error);
      });
  };

  const CustomDrawerContent = (props) => (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.adminHeader}>
          <Image source={getProfileImage()} style={styles.adminProfileImage} />
          <Text style={styles.adminDoctorName}>{doctorName}</Text>
          <Text style={styles.adminDoctorEmail}>{doctorEmail}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.adminLogoutButton} onPress={handleLogout}>
        <Text style={styles.adminLogoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="HastaListesi"
        component={HastaListesi}
        options={{ title: 'Hasta Listesi', headerShown: false }}
      />
      <Stack.Screen
        name="TahlilEkle"
        component={TahlilEkle}
        options={{ title: 'Tahlil Ekle', headerShown: false }}
      />
      <Stack.Screen
        name="Tahliller"
        component={Tahliller}
        options={{ title: 'Tahlil Sonuçları', headerShown: false }}
      />
      <Stack.Screen
        name="HastaEkle"
        component={HastaEkle}
        options={{ title: 'Hasta Ekle', headerShown: false }}
      />
      <Stack.Screen
        name="KilavuzEkle"
        component={KilavuzEkle}
        options={{ title: 'Kılavuz Ekle', headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: 'Ayarlar', headerShown: false }}
      />
    </Stack.Navigator>
  );

  return (
    <Drawer.Navigator
      initialRouteName="Hasta Listesi"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Hasta Listesi" component={HomeStack} />
      <Drawer.Screen name="Tahlil Ekle" component={TahlilEkle} />
      {/*<Drawer.Screen name="Hasta Ekle" component={HastaEkle} />*/}
      <Drawer.Screen name="Kılavuz Ekle" component={KilavuzEkle} />
      <Drawer.Screen name="Ayarlar" component={Settings} />
    </Drawer.Navigator>
  );
}
