import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const HastaEkle = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [yas, setYas]=useState('');
  const [cinsiyet, setCinsiyet]=useState('');

  // Veritabanına hasta eklemek için fonksiyon
  const handleAddPatient = async () => {
    if (!fullName || !email) {
      Alert.alert('Eksik Alan', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      // Firestore'da 'users' koleksiyonuna yeni hasta ekleme
      const docRef = await addDoc(collection(db, 'users'), {
        fullName,
        email,
        role: 'user',
        cinsiyet,
        yas, // role alanı ekleniyor
      });

      // Eklenen hastanın id'si Firestore tarafından otomatik olarak verilecektir
      console.log("Yeni Hasta Eklendi, ID:", docRef.id);

      Alert.alert('Başarılı', 'Hasta başarıyla eklendi!');

      // Formu sıfırlama
      setFullName('');
      setEmail('');
      setCinsiyet('');
      setYas('');
    } catch (error) {
      console.error('Hasta eklenirken hata oluştu: ', error);
      Alert.alert('Hata', 'Bir hata oluştu, tekrar deneyin');
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
    width: 150, // Resmin genişliği
    height: 150, // Resmin yüksekliği
    resizeMode: 'contain', // Resmi oranlı şekilde yerleştir
    alignSelf: 'center', // Resmi ortala
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Başlık rengi
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
    marginRight: 20
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HastaEkle;
