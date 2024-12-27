import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,TouchableOpacity } from 'react-native';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import styles from './styles';
import UserDetails from '../UserDetails/UserDetails';

export default function HomePage({navigation}) {
  const [doctorName, setDoctorName] = useState('');
  const [users, setUsers] = useState([]); // Kullanıcıları tutacak state

  // Doktor bilgilerini çekme
  useEffect(() => {
    const fetchDoctorData = async () => {
      const currentUser = auth.currentUser; // Giriş yapan doktor
      if (currentUser) {
        try {
          const doctorRef = doc(db, 'doctors', currentUser.uid);
          const doctorDoc = await getDoc(doctorRef);
          if (doctorDoc.exists()) {
            setDoctorName(doctorDoc.data().fullname); // Doktor adını kaydet
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

  // Tüm kullanıcıları çekme
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

  // Kullanıcılar için render fonksiyonu
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem} // Dokunma alanının stili
      onPress={() => handleUserPress(item)} // Tıklama olayını tanımlar
    >
      <Text style={styles.userText}>{item.fullName || 'No Name Available'}</Text>

    </TouchableOpacity>
  );

  const handleUserPress = (user) => {
    console.log('Tiklanan Kullanici:', user);
    // Kullanıcı detay sayfasına yönlendirme
    //navigation.navigate('UserDetails', { userId: user.id, fullname: user.fullname });
    navigation.navigate('UserDetails', { userId: user.id, fullName: user.fullName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Dr. {doctorName || 'Loading...'}</Text>
      <Text style={styles.title}>All Users:</Text>
      <FlatList
        data={users} // Kullanıcılar listesi
        keyExtractor={(item, index) => index.toString()} // Benzersiz anahtar
        renderItem={renderUserItem} // Kullanıcıyı render et
        style={styles.user_list}
      />
    </View>
  );
}
