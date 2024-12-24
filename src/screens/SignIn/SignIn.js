import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// E-posta formatını kontrol etmek için fonksiyon
const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
};

export default function App({ navigation }) {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    const onRegisterPress = async () => {
        // E-posta geçerliliğini kontrol et
        if (!isValidEmail(email)) {
            console.log(error);
            Alert.alert("Hata", "Geçerli bir e-posta adresi giriniz.");
            
            return;
        }

        // Şifrelerin uyuşup uyuşmadığını kontrol et
        if (password !== confirmPassword) {
            Alert.alert("Hata", "Şifreler uyuşmuyor.");
            return;
        }

        // Kullanıcıyı Firebase Authentication ile oluştur
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const data = {
                id: uid,
                email,
                fullName,
                role: 'user',
            };

            // Kullanıcı verisini Firestore'a kaydet
            await setDoc(doc(db, 'users', uid), data);
            navigation.navigate('Login', { user: data });
        } catch (error) {
            // Hata mesajını göster
            Alert.alert("Kayıt Hatası", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <ImageBackground
                    source={require('../../../assets/images/loginbackground.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/login.jpg')}
                    />
                    {/* Full name input field */}
                    <TextInput
                        style={styles.input}
                        placeholder='Full Name'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* Email input field */}
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* Password input field */}
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Password'
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* Confirm password input field */}
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Confirm Password'
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* Register button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onRegisterPress}>
                        <Text style={styles.buttonTitle}>Create account</Text>
                    </TouchableOpacity>
                    {/* Footer link to navigate to the login screen */}
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        </View>
    );
}
