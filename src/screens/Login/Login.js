import React, { useState } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App({ navigation }) {
  const [email, setEmail] = useState(''); // E-posta girişini tutan state
  const [password, setPassword] = useState(''); // Şifre girişini tutan state

  // "Kayıt Ol" linkine tıklandığında, kullanıcıyı kayıt ol ekranına yönlendirme
  const onFooterLinkPress = () => {
    navigation.navigate('SignIn'); // Kayıt ol ekranına yönlendirme
  };

  // Giriş yapma işlemi
  const handleLogin = async () => {
    // E-posta veya şifre boşsa hata mesajı göster
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return; // Eksik alan varsa işlemi durdur
    }

    try {
      // Firebase Authentication ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

     
      console.log('Giriş Yapan Kullanıcının UID\'si:', uid);
        // Token'ı yenile
      //const userToken = await userCredential.user.getIdToken(true); // 'true' yeni token alır
      //console.log('Yeni Token:', userToken);

      const userToken = await userCredential.user.getIdToken(true);
      // Hem 'users' hem de 'doctors' koleksiyonlarında arama yapılacak
      const userDocRef = doc(db, 'users', uid);
      const doctorDocRef = doc(db, 'doctors', uid);
    
      // Kullanıcı bilgilerini al
      const userDoc = await getDoc(userDocRef);
      const doctorDoc = await getDoc(doctorDocRef);

      let userData;

      // Kullanıcı verilerini kontrol et
      if (userDoc.exists()) {
        console.log("Kullanıcı verisi bulundu:", userDoc.data());  // Kullanıcı verisini konsola yazdır
        userData = userDoc.data();
      } else if (doctorDoc.exists()) {
        console.log("Doktor verisi bulundu:", doctorDoc.data());  // Doktor verisini konsola yazdır
        userData = doctorDoc.data();
        console.log(userData.role);
      } else {
        console.log("Kullanıcı veya doktor verisi bulunamadı");
      }

      // Kullanıcı bulunamazsa hata mesajı göster
      if (!userData) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı!');
        return;
      }

      // Kullanıcı verilerini AsyncStorage'a kaydet
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Kullanıcının rolüne göre yönlendirme yap
      if (userData.role === 'doctor') {
        // Eğer kullanıcı doktor ise AdminPanel ekranına yönlendir
        navigation.navigate('AdminPanel', { user: userData });
      } else if (userData.role === 'user') {
        // Eğer kullanıcı hasta ise UserPanel ekranına yönlendir
        navigation.navigate('UserPanel', { user: userData });
      } else {
        // Rol tanımlanmamışsa hata mesajı göster
        Alert.alert('Hata', 'Kullanıcı rolü tanımlanmamış.');
      }

    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendir
      //console.log('Error:', error.message || error.toString());
      console.log('Error:', error.message || error.toString());
      Alert.alert('Giriş Hatası', error.message || error.toString());
    }
  };

  return (
    <View style={styles.screenContainer}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={require('../../../assets/images/loginbackground.png')} // Arkaplan resmi
          style={styles.background}
          resizeMode="cover"
        >
          {/* Logo ve başlık */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/loginlogo.png')} // Logo resmi
              style={styles.logo}
            />
            <Text style={styles.loginText}>SağlıkNet</Text>
          </View>

          {/* Giriş için input alanları ve buton */}
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#aaaaaa"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={email}
              onChangeText={(text) => setEmail(text)} // E-posta state güncelleme
            />
            <TextInput
              style={styles.input}
              placeholder='Şifre'
              placeholderTextColor="#aaaaaa"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)} // Şifre state güncelleme
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text> 
            </TouchableOpacity>
            <View style={styles.footerView}>
              <Text style={styles.footerText}>Hesabınız yok mu? </Text>
              <Text onPress={onFooterLinkPress} style={styles.footerLink}> Kayıt Ol</Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </View>
  );
}
