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

    // Kullanıcının tam adını, e-postasını ve şifrelerini tutmak için state tanımları
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Kullanıcıyı giriş ekranına yönlendiren fonksiyon
    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    // Kayıt işlemini gerçekleştiren asenkron fonksiyon
    const onRegisterPress = async () => {
<<<<<<< HEAD
        // E-posta geçerliliğini kontrol et
        if (!isValidEmail(email)) {
            console.log(error);
            Alert.alert("Hata", "Geçerli bir e-posta adresi giriniz.");
            
=======
        // Şifrelerin eşleşip eşleşmediğini kontrol et
        if (password !== confirmPassword) {
            alert("Passwords don't match.");
>>>>>>> 8f913d0f0a3d0d2b7d7de40888e3ba37216d42d1
            return;
        }

        // Şifrelerin uyuşup uyuşmadığını kontrol et
        if (password !== confirmPassword) {
            Alert.alert("Hata", "Şifreler uyuşmuyor.");
            return;
        }

        // Kullanıcıyı Firebase Authentication ile oluştur
        try {
            // Firebase Authentication ile kullanıcı oluştur
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Kullanıcı bilgilerini Firestore'a kaydet
            const data = {
                id: uid,
                email,
                fullName,
                role: 'user',
            };

            // Kullanıcı verisini Firestore'a kaydet
            await setDoc(doc(db, 'users', uid), data);
<<<<<<< HEAD
            navigation.navigate('Login', { user: data });
        } catch (error) {
            // Hata mesajını göster
            Alert.alert("Kayıt Hatası", error.message);
=======

            // Başarıyla kayıt olunduktan sonra ana sayfaya yönlendirme
            navigation.navigate('Home', { user: data });
        } catch (error) {
            // Hata durumunda uyarı mesajı göster
            alert(error.message);
>>>>>>> 8f913d0f0a3d0d2b7d7de40888e3ba37216d42d1
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/* Arka plan resmi */}
                <ImageBackground
                    source={require('../../../assets/images/loginbackground.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    {/* Uygulama logosu */}
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/login.jpg')}
                    />
                    {/* Tam ad giriş alanı */}
                    <TextInput
                        style={styles.input}
                        placeholder='Full Name'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* E-posta giriş alanı */}
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {/* Şifre giriş alanı */}
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
                    {/* Şifre onay giriş alanı */}
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
                    {/* Kayıt ol butonu */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onRegisterPress}>
                        <Text style={styles.buttonTitle}>Create account</Text>
                    </TouchableOpacity>
                    {/* Giriş ekranına yönlendiren alt bilgi */}
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        </View>
    );
}
