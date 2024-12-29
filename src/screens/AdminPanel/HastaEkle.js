import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db, auth } from '../../firebase/config'; // Firebase Auth ve Firestore import
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// E-posta formatını kontrol etmek için fonksiyon
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

const HastaEkle = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [yas, setYas] = useState('');
  const [cinsiyet, setCinsiyet] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Kullanıcı kaydını ve Firestore'a eklemeyi gerçekleştiren fonksiyon
  const handleAddPatient = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Eksik Alan', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor.');
      return;
    }

    try {
      // Firebase Authentication ile kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı bilgilerini Firestore'a kaydet
      const userData = {
        fullName,
        email,
        yas,
        cinsiyet,
        role: 'user', // 'user' rolü ile
        uid: user.uid, // Firebase Authentication UID
      };

      // Firestore'a kullanıcı verisini ekle
      await setDoc(doc(db, 'users', user.uid), userData);

      // Başarı mesajı
      Alert.alert('Başarılı', 'Hasta başarıyla eklendi!');
      navigation.navigate('HastaListesi'); // Login ekranına yönlendirme

      // Formu sıfırlama
      setFullName('');
      setEmail('');
      setYas('');
      setCinsiyet('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Hasta eklenirken hata oluştu: ', error);
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/hastaekle.png')} style={styles.logo} />
      <Text style={styles.title}>Hasta Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş"
        keyboardType="numeric"
        value={yas}
        onChangeText={setYas}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifreyi Onayla"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Cinsiyet"
        value={cinsiyet}
        onChangeText={setCinsiyet}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HastaEkle;
