import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

export default function Settings({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFullName(userData.fullName || '');
                        setEmail(currentUser.email || '');
                    }
                } catch (error) {
                    console.error('Kullanıcı bilgileri getirilemedi:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            
            // Email güncellemesi
            if (email && email !== currentUser.email) {
                try {
                    // Önce Authentication'da email'i güncelle
                    await updateEmail(currentUser, email);
                    
                    // Sonra Firestore'u güncelle
                    await updateDoc(userRef, {
                        fullName,
                        email
                    });

                    // Başarılı mesajı göster ve yeniden giriş yaptır
                     Alert.alert(
                        'Başarılı',
                        'E-posta adresiniz güncellendi. Güvenlik nedeniyle yeniden giriş yapmanız gerekmektedir.',
                        [
                            {
                                text: 'Tamam',
                                onPress: () => {
                                    // Oturumu kapat ve login sayfasına yönlendir
                                    auth.signOut().then(() => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Login' }],
                                        });
                                    });
                                }
                            }
                        ]
                    );
                    return;
                } catch (emailError) {
                    console.error('Email güncelleme hatası:', emailError);
                    
                    if (emailError.code === 'auth/requires-recent-login') {
                        Alert.alert(
                            'Yeniden Giriş Gerekli',
                            'E-posta adresini güncellemek için lütfen tekrar giriş yapın.',
                            [
                                {
                                    text: 'Tamam',
                                    onPress: () => {
                                        auth.signOut().then(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' }],
                                            });
                                        });
                                    },
                                },
                            ]
                        );
                    } else if (emailError.code === 'auth/invalid-email') {
                        Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
                    } else if (emailError.code === 'auth/email-already-in-use') {
                        Alert.alert('Hata', 'Bu e-posta adresi başka bir hesap tarafından kullanılıyor.');
                    } else {
                        Alert.alert('Hata', 'E-posta güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                    }
                    return;
                }
            }

            // Sadece isim güncellemesi
            try {
                await updateDoc(userRef, {
                    fullName
                });
                Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
            } catch (error) {
                console.error('İsim güncelleme hatası:', error);
                Alert.alert('Hata', 'Bilgileriniz güncellenirken bir hata oluştu.');
            }

            // Şifre güncellemesi
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    Alert.alert('Hata', 'Girdiğiniz şifreler eşleşmiyor.');
                    return;
                }

                if (password.length < 6) {
                    Alert.alert('Hata', 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
                    return;
                }

                try {
                    await updatePassword(currentUser, password);
                    //Alert.alert('Başarılı', 'Şifreniz güncellendi.');
                    setPassword('');
                    setConfirmPassword('');
                } catch (passwordError) {
                    console.error('Şifre güncelleme hatası:', passwordError);
                    if (passwordError.code === 'auth/requires-recent-login') {
                        Alert.alert(
                            'Yeniden Giriş Gerekli',
                            'Şifrenizi güncellemek için lütfen tekrar giriş yapın.',
                            [
                                {
                                    text: 'Tamam',
                                    onPress: () => {
                                        auth.signOut().then(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' }],
                                            });
                                        });
                                    },
                                },
                            ]
                        );
                    } else {
                        Alert.alert('Hata', 'Şifre güncellenirken bir hata oluştu.');
                    }
                }
            }
        } catch (error) {
            console.error('Güncelleme sırasında hata:', error);
            let errorMessage = 'Bilgileriniz güncellenirken bir hata oluştu.';

            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçerli bir e-posta adresi girin.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi başka bir hesap tarafından kullanılıyor.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Şifre çok zayıf. Lütfen daha güçlü bir şifre girin.';
            }
            
            Alert.alert('Hata', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('UserPanel')}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.label}>Ad Soyad:</Text>
            <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={(text) => setFullName(text)}
            />
            <Text style={styles.label}>E-posta:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Şifre:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                placeholder="Yeni şifre (opsiyonel)"
            />
            <Text style={styles.label}>Şifre Tekrar:</Text>
            <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
                placeholder="Yeni şifre tekrar"
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Bilgileri Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
}
