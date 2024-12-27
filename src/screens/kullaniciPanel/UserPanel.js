import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { userPanelStyles as styles } from './styles';

const UserPanel = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı.');
    }
  };

  const handleViewResults = () => {
    navigation.navigate('TestResults');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sol Panel */}
      <View style={styles.leftPanel}>
        <Image
          source={userData.photoURL ? { uri: userData.photoURL } : require('../../../assets/emirhan.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData.name || 'İsimsiz Kullanıcı'}</Text>
        <Text style={styles.userInfo}>{userData.email}</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Sağ Panel */}
      <View style={styles.rightPanel}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleViewResults}
        >
          <Text style={styles.buttonText}>Tahlil Sonuçlarım</Text>
        </TouchableOpacity>
        
        {/* Kullanıcı Bilgileri */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Hasta Bilgileri</Text>
          <Text style={styles.infoText}>TC Kimlik: {userData.tcKimlik || 'Belirtilmemiş'}</Text>
          <Text style={styles.infoText}>Doğum Tarihi: {userData.dogumTarihi || 'Belirtilmemiş'}</Text>
          <Text style={styles.infoText}>Kan Grubu: {userData.kanGrubu || 'Belirtilmemiş'}</Text>
          <Text style={styles.infoText}>Telefon: {userData.telefon || 'Belirtilmemiş'}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserPanel;
