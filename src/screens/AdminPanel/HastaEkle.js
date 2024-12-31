import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db, auth } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

// E-posta formatını kontrol etmek için fonksiyon
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

const HastaEkle = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cinsiyet, setCinsiyet] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  // Kullanıcı kaydını ve Firestore'a eklemeyi gerçekleştiren fonksiyon
  const handleAddPatient = async () => {
    if (!fullName || !email || !password || !confirmPassword || !cinsiyet) {
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

    // Doğum tarihi kontrolü
    const today = new Date();
    if (birthDate > today) {
      Alert.alert('Hata', 'Doğum tarihi bugünden ileri bir tarih olamaz.');
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
        birthDate,
        cinsiyet,
        role: 'user',
        uid: user.uid,
      };

      // Firestore'a kullanıcı verisini ekle
      await setDoc(doc(db, 'users', user.uid), userData);

      // Başarı mesajı
      Alert.alert('Başarılı', 'Hasta başarıyla eklendi!');
      navigation.navigate('HastaListesi');

      // Formu sıfırlama
      setFullName('');
      setEmail('');
      setBirthDate(new Date());
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

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>
          Doğum Tarihi: {birthDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Cinsiyet"
        value={cinsiyet}
        onChangeText={setCinsiyet}
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddPatient}>
        <Text style={styles.buttonTitle}>Hasta Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    margin: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButton: {
    height: 48,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    width: '100%',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HastaEkle;
