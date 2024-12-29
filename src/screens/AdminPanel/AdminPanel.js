import { View, Text, StyleSheet, Image ,TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
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
  const navigation = useNavigation(); // useNavigation hook'unu kullan

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('Çıkış yapıldı.');
        navigation.navigate('Login'); // Giriş ekranına yönlendir
      })
      .catch((error) => {
        console.error('Çıkış yapılırken bir hata oluştu:', error);
      });
  };
  

  useEffect(() => {
    const fetchDoctorData = async () => {
      const currentUser = auth.currentUser; // Giriş yapan doktor icin
      if (currentUser) {
        setDoctorEmail(currentUser.email); // Doktorun emailini kaydeder

        try {
          const doctorRef = doc(db, 'doctors', currentUser.uid);
          const doctorDoc = await getDoc(doctorRef);
          if (doctorDoc.exists()) {
            setDoctorName(doctorDoc.data().fullname); // Doktor adını kaydeder
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

  // Tüm kullanıcıları çekmek icin
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersRef = collection(db, "users"); // 'users' koleksiyonunu referans al
        const querySnapshot = await getDocs(usersRef);

        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data()); // Kullanıcıları listeye ekle
        });

        setUsers(usersList); // Kullanıcıları state'e kaydet
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
            source={require('../../../assets/merve.png')}
            style={styles.image}
          />
          <Text style={styles.title}>{doctorName || 'Loading...'}</Text>
          <Text style={styles.email}>{doctorEmail || 'Loading...'}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Çıkış Butonu */}
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
      {/*<Drawer.Screen name="Tahlil Sonuçları" component={Tahliller} />*/}
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  logoutButton: {
    marginBottom: 30,
    padding: 15,
    width:200,
    height:50,
    borderRadius:30,
    backgroundColor: '#ff5555',
    alignItems: 'center',
    justifyContent: 'center',
    margin:'auto'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
