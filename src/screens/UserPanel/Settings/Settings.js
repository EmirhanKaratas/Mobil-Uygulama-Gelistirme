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
            // Firestore bilgilerini güncelle
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { fullName });

            // Firebase Authentication e-postasını güncelle
            if (email && email !== currentUser.email) {
                await updateEmail(currentUser, email);
            }

            // Firebase Authentication şifresini güncelle
            if (password) {
                if (password.length < 6) {
                    Alert.alert('Hata', 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
                    return;
                }
                await updatePassword(currentUser, password);
            }

            Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
            navigation.goBack();
        } catch (error) {
            console.error('Güncelleme sırasında hata:', error);
            let errorMessage = 'Bilgileriniz güncellenirken bir hata oluştu.';

            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Bu işlemi gerçekleştirmek için tekrar giriş yapmanız gerekiyor.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçerli bir e-posta adresi girin.';
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
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Bilgileri Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
}

