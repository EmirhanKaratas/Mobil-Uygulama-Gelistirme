import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

// E-posta formatını kontrol etmek için fonksiyon
const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
};

export default function App({ navigation }) {
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

    // Kullanıcıyı giriş ekranına yönlendiren fonksiyon
    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    // Kayıt işlemini gerçekleştiren asenkron fonksiyon
    const onRegisterPress = async () => {
        if (!fullName || !email || !password || !confirmPassword || !cinsiyet) {
            Alert.alert('Eksik Alan', 'Lütfen tüm alanları doldurun');
            return;
        }

        // E-posta geçerliliğini kontrol et
        if (!isValidEmail(email)) {
            Alert.alert("Hata", "Geçerli bir e-posta adresi giriniz.");
            return;
        }

        // Şifrelerin uyuşup uyuşmadığını kontrol et
        if (password !== confirmPassword) {
            Alert.alert("Hata", "Şifreler uyuşmuyor.");
            return;
        }

        // Doğum tarihi kontrolü
        const today = new Date();
        if (birthDate > today) {
            Alert.alert('Hata', 'Doğum tarihi bugünden ileri bir tarih olamaz.');
            return;
        }

        try {
            // Firebase Authentication ile kullanıcı oluştur
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Kullanıcı bilgilerini Firestore'a kaydet
            const data = {
                id: uid,
                email,
                fullName,
                birthDate,
                cinsiyet,
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
                    <TextInput
                        style={styles.input}
                        placeholder='Ad Soyad'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
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
                        placeholder='Cinsiyet'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setCinsiyet(text)}
                        value={cinsiyet}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='E-posta'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Şifre'
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Şifreyi Onayla'
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onRegisterPress}>
                        <Text style={styles.buttonTitle}>Hesap Oluştur</Text>
                    </TouchableOpacity>

                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Hesabınız var mı? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Giriş Yap</Text></Text>
                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        </View>
    );
}
