import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons kütüphanesini ekledik
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './styles';

export default function UserPanel({ navigation }) {
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userAge, setUserAge] = useState(null);
  const [tahliller, setTahliller] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Eğer ay veya gün farkı negatifse yaşı bir azalt
    }
    return age;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          // Kullanıcı bilgilerini getir
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName);
            setUserGender(userData.cinsiyet);

            // Yaş hesaplama
            if (userData.birthDate) {
              const birthDate = new Date(userData.birthDate.seconds * 1000); // Firebase Timestamp'ten Date'e çevir
              const age = calculateAge(birthDate);
              setUserAge(age);
            }
          } else {
            console.log('Kullanıcı bulunamadı');
          }

          // Kullanıcının tahlillerini getir
          const tahlilRef = collection(db, 'tahliller');
          const q = query(tahlilRef, where('userId', '==', currentUser.uid));
          const tahlilDocs = await getDocs(q);

          const tahlilList = [];
          tahlilDocs.forEach((doc) => {
            tahlilList.push({ id: doc.id, ...doc.data() });
          });
          setTahliller(tahlilList);
        } catch (error) {
          console.error('Hata:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const getProfileImage = () => {
    const gender = (userGender || '').toLowerCase().trim();
    switch (gender) {
      case 'erkek':
        return require('../../../assets/maleprofile.png');
      case 'kadın':
        return require('../../../assets/femaleprofile.png');
      default:
        return require('../../../assets/default.png');
    }
  };

  const renderTahlilItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tahlilItem}
      onPress={() => navigation.navigate('TestResults', { tahlil: item })} // Detay ekranına geçiş
    >
      <Text style={styles.tahlilText}>{item.date.toDate().toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
          <Image source={getProfileImage()} style={styles.profileImage} />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userDetails}>
            {userGender ? `Cinsiyet: ${userGender}` : ''}
            {userAge !== null ? ` | Yaş: ${userAge}` : ''}
          </Text>
          <FlatList
            data={tahliller}
            keyExtractor={(item) => item.id}
            renderItem={renderTahlilItem}
            style={styles.tahlilList}
          />
        </>
      )}
    </View>
  );
}
