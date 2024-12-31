import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import HastaListesi from './HastaListesi';
import TahlilEkle from './TahlilEkle';
import HastaEkle from './HastaEkle';
import Tahliller from './Tahliller';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function AdminPanel() {
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorGender, setDoctorGender] = useState('');
  const [users, setUsers] = useState([]); 
  const navigation = useNavigation();

  const getProfileImage = () => {
    return doctorGender === 'Kadın' 
      ? require('../../../assets/femaleprofile.png')
      : require('../../../assets/maleprofile.png');
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data());
        });

        setUsers(usersList);
      } catch (error) {
        console.error('Hata:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const CustomDrawerContent = (props) => (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <Image
            source={getProfileImage()}
            style={styles.profileImage}
          />
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorEmail}>{doctorEmail}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
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
    </Stack.Navigator>
  );

  return (
    <Drawer.Navigator
      initialRouteName="Hasta Listesi"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Hasta Listesi" component={HomeStack} />
      <Drawer.Screen name="Tahlil Ekle" component={TahlilEkle} />
      <Drawer.Screen name="Hasta Ekle" component={HastaEkle} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doctorEmail: {
    fontSize: 14,
    color: 'gray',
  },
  logoutButton: {
    marginBottom: 30,
    padding: 15,
    width: 200,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#ff5555',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
