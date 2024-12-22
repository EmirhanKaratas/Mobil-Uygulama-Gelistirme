import React, { useState } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Kayıt Olma Linki
  const onFooterLinkPress = () => {
    navigation.navigate('SignIn'); // Kayıt ol ekranına yönlendirme
  };

  // Giriş İşlemi
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return; // Eksik alan varsa işlemi durdur
    }

    try {
      // Firebase Authentication ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('Giriş Yapan Kullanıcının UID\'si:', uid);
    
      // Hem 'users' hem de 'doctors' koleksiyonlarında arama yapılacak
      const userDocRef = doc(db, 'users', uid);
      const doctorDocRef = doc(db, 'doctors', uid);
    
      // Kullanıcı bilgilerini al
      const userDoc = await getDoc(userDocRef);
      const doctorDoc = await getDoc(doctorDocRef);
    
      let userData;
    
      // Kullanıcı verilerini kontrol et
      if (userDoc.exists()) {
        console.log("Kullanıcı verisi bulundu:", userDoc.data());  // Konsola yazdırma
        userData = userDoc.data();
      } else if (doctorDoc.exists()) {
        console.log("Doktor verisi bulundu:", doctorDoc.data());  // Konsola yazdırma
        userData = doctorDoc.data();
      } else {
        console.log("Kullanıcı veya doktor verisi bulunamadı");
      }
    
      // Kullanıcı bulunamazsa
      if (!userData) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı!');
        return;
      }
    
      // Kullanıcı verilerini AsyncStorage'a kaydet
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    
      // Kullanıcının rolünü kontrol et
      if (userData.role === 'doctor') {
        // Doctor ise AdminPanel'e yönlendir
        navigation.navigate('AdminPanel', { user: userData });
      } else {
        // Diğer kullanıcıyı beklemede tut
        Alert.alert('Yetkisiz Giriş', 'Bu hesap yönetici yetkisine sahip değil.');
      }
    
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendir
      console.log(error); // Error objesini konsola yazdırın
      Alert.alert('Giriş Hatası', error.message || error.toString());
    }
    
    
  };

  return (
    <View style={styles.screenContainer}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={require('../../../assets/images/loginbackground.png')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Logo ve Login Başlığı */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/loginlogo.png')}
              style={styles.logo}
            />
            <Text style={styles.loginText}>HEALTH CENTER</Text>
          </View>

          {/* Input ve Butonlar */}
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#aaaaaa"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              placeholderTextColor="#aaaaaa"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
              <Text style={styles.footerText}>Hesabınız yok mu? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Kayıt Ol</Text></Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </View>
  );
}
