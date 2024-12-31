import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { useDoctor } from '../../../context/DoctorContext';

export default function Settings({ navigation }) {
    const { setDoctorName } = useDoctor();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    useEffect(() => {
        const fetchDoctorData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const doctorRef = doc(db, 'doctors', currentUser.uid);
                    const doctorDoc = await getDoc(doctorRef);
                    if (doctorDoc.exists()) {
                        const doctorData = doctorDoc.data();
                        setFullName(doctorData.fullname || '');
                        setEmail(currentUser.email || '');
                    }
                } catch (error) {
                    console.error('Doktor bilgileri getirilemedi:', error);
                }
            }
        };

        fetchDoctorData();
    }, []);

    const reauthenticate = async (currentPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
    };

    const promptForPassword = () => {
        setShowCurrentPassword(true);
    };

    const handleUpdate = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const doctorRef = doc(db, 'doctors', currentUser.uid);
            
            // Email güncellemesi
            if (email && email !== currentUser.email) {
                if (!currentPassword) {
                    promptForPassword();
                    return;
                }

                try {
                    await reauthenticate(currentPassword);
                    await updateEmail(currentUser, email);
                    
                    await updateDoc(doctorRef, {
                        fullname: fullName,
                        email
                    });

                    Alert.alert(
                        'Başarılı',
                        'E-posta adresiniz güncellendi. Güvenlik nedeniyle yeniden giriş yapmanız gerekmektedir.',
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
                                }
                            }
                        ]
                    );
                    return;
                } catch (emailError) {
                    console.error('Email güncelleme hatası:', emailError);
                    
                    if (emailError.code === 'auth/wrong-password') {
                        Alert.alert('Hata', 'Girdiğiniz mevcut şifre yanlış.');
                        setCurrentPassword('');
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
                await updateDoc(doctorRef, {
                    fullname: fullName
                });
                setDoctorName(fullName); // Context'teki ismi güncelle
                Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
            } catch (error) {
                console.error('İsim güncelleme hatası:', error);
                Alert.alert('Hata', 'Bilgileriniz güncellenirken bir hata oluştu.');
            }

            // Şifre güncellemesi
            if (password) {
                if (!currentPassword) {
                    promptForPassword();
                    return;
                }

                if (password.length < 6) {
                    Alert.alert('Hata', 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
                    return;
                }

                try {
                    await reauthenticate(currentPassword);
                    await updatePassword(currentUser, password);
                    Alert.alert('Başarılı', 'Şifreniz güncellendi.');
                    setPassword('');
                    setCurrentPassword('');
                    setShowCurrentPassword(false);
                } catch (passwordError) {
                    console.error('Şifre güncelleme hatası:', passwordError);
                    if (passwordError.code === 'auth/wrong-password') {
                        Alert.alert('Hata', 'Girdiğiniz mevcut şifre yanlış.');
                        setCurrentPassword('');
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
            {showCurrentPassword && (
                <>
                    <Text style={styles.label}>Mevcut Şifre:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={(text) => setCurrentPassword(text)}
                        secureTextEntry
                        placeholder="Güvenlik için mevcut şifrenizi girin"
                    />
                </>
            )}
            <Text style={styles.label}>Yeni Şifre:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                placeholder="Yeni şifre (opsiyonel)"
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Bilgileri Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
}
