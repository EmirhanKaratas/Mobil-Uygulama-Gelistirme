import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import styles from './styles';

const KilavuzEkle = () => {
    const [selectedType, setSelectedType] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [kilavuzDegerleri, setKilavuzDegerleri] = useState({
        max_age_months: '',
        max_val: '',
        min_age_months: '',
        min_val: '',
    });

    const igTurleri = ['IgA', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4', 'IgM'];

    const handleDegerChange = (key, value) => {
        if (key.includes('_val') || key.includes('_months')) {
            const numValue = value.replace(/[^0-9.]/g, '');
            setKilavuzDegerleri(prev => ({
                ...prev,
                [key]: numValue
            }));
        } else {
            setKilavuzDegerleri(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const validateInputs = () => {
        if (!selectedType) {
            Alert.alert('Hata', 'Lütfen bir Ig türü seçin');
            return false;
        }

        if (!collectionName.trim()) {
            Alert.alert('Hata', 'Lütfen bir koleksiyon ismi girin');
            return false;
        }

        const requiredFields = ['max_age_months', 'max_val', 'min_age_months', 'min_val'];
        for (const field of requiredFields) {
            if (!kilavuzDegerleri[field]) {
                Alert.alert('Hata', `Lütfen ${field} değerini girin`);
                return false;
            }
        }

        if (parseFloat(kilavuzDegerleri.min_val) >= parseFloat(kilavuzDegerleri.max_val)) {
            Alert.alert('Hata', 'Minimum değer, maximum değerden küçük olmalıdır');
            return false;
        }

        if (parseInt(kilavuzDegerleri.min_age_months) >= parseInt(kilavuzDegerleri.max_age_months)) {
            Alert.alert('Hata', 'Minimum ay, maximum aydan küçük olmalıdır');
            return false;
        }

        return true;
    };

    const kilavuzKaydet = async () => {
        try {
            if (!validateInputs()) return;

            const kayitVerisi = {
                ...kilavuzDegerleri,
                type: selectedType,
                max_age_months: parseInt(kilavuzDegerleri.max_age_months),
                min_age_months: parseInt(kilavuzDegerleri.min_age_months),
                max_val: parseFloat(kilavuzDegerleri.max_val),
                min_val: parseFloat(kilavuzDegerleri.min_val)
            };

            await addDoc(collection(db, collectionName), kayitVerisi);

            Alert.alert('Başarılı', 'Kılavuz değerleri başarıyla kaydedildi.');
            
            // Formu temizle
            setKilavuzDegerleri({
                max_age_months: '',
                max_val: '',
                min_age_months: '',
                min_val: '',
            });
            setSelectedType('');
            setCollectionName('');

        } catch (error) {
            console.error('Kayıt hatası:', error);
            Alert.alert('Hata', 'Kılavuz değerleri kaydedilirken bir hata oluştu.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Kılavuz Değerleri Ekle</Text>
            <Text style={styles.description}>
                Seçilen Ig türü için yaş ve değer aralıklarını belirleyin.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Koleksiyon İsmi:</Text>
                <TextInput
                    style={styles.input}
                    value={collectionName}
                    onChangeText={setCollectionName}
                    placeholder="Koleksiyon ismini girin"
                />
            </View>

            <View style={styles.typeContainer}>
                {igTurleri.map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.typeButton,
                            selectedType === type && styles.selectedTypeButton
                        ]}
                        onPress={() => setSelectedType(type)}
                    >
                        <Text style={[
                            styles.typeButtonText,
                            selectedType === type && styles.selectedTypeButtonText
                        ]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Minimum Ay:</Text>
                <TextInput
                    style={styles.input}
                    value={kilavuzDegerleri.min_age_months}
                    onChangeText={(value) => handleDegerChange('min_age_months', value)}
                    placeholder="Minimum ay değerini girin"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Maximum Ay:</Text>
                <TextInput
                    style={styles.input}
                    value={kilavuzDegerleri.max_age_months}
                    onChangeText={(value) => handleDegerChange('max_age_months', value)}
                    placeholder="Maximum ay değerini girin"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Minimum Değer:</Text>
                <TextInput
                    style={styles.input}
                    value={kilavuzDegerleri.min_val}
                    onChangeText={(value) => handleDegerChange('min_val', value)}
                    placeholder="Minimum değeri girin"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Maximum Değer:</Text>
                <TextInput
                    style={styles.input}
                    value={kilavuzDegerleri.max_val}
                    onChangeText={(value) => handleDegerChange('max_val', value)}
                    placeholder="Maximum değeri girin"
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity 
                style={[styles.button, (!selectedType || !collectionName.trim()) && styles.disabledButton]} 
                onPress={kilavuzKaydet}
                disabled={!selectedType || !collectionName.trim()}
            >
                <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default KilavuzEkle;
