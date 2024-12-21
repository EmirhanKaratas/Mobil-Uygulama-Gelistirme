import React, { useState } from 'react';
import { Text, TextInput, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onFooterLinkPress = () => {
    navigation.navigate('SignIn');
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    } else {
      Alert.alert('Başarılı', 'Hoşgeldiniz, ${email}');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        alert("User does not exist anymore.");
        return;
      }
      const userData = userDoc.data();
      await AsyncStorage.setItem('user', JSON.stringify(userData));  // Save user data
      navigation.navigate('Home', { user: userData });
    } catch (error) {
      alert(error.message);
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
          {/* Logo ve Login Text */}
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
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
              <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </View>
  );
}