import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import styles from './styles';

const TahlilEkle = () => {
    const [aramaAdi, setAramaAdi] = useState('');
    const [bulunanHasta, setBulunanHasta] = useState(null);
    const [tahlilDegerleri, setTahlilDegerleri] = useState({
        IgA: '',
        IgG: '',
        IgG1: '',
        IgG2: '',
        IgG3: '',
        IgG4: '',
        IgM: ''
    });

    // Yaş hesaplama fonksiyonu
    const calculateAgeInMonths = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate.seconds * 1000); // Firebase Timestamp'i Date'e çevir
        
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();
        
        // Ayın gününe göre düzeltme
        if (today.getDate() < birth.getDate()) {
            months--;
        }
        
        return months;
    };

    // Yaş gösterimi için formatlama fonksiyonu
    const formatAge = (months) => {
        if (months < 12) {
            return `${months} aylık`;
        } else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            if (remainingMonths === 0) {
                return `${years} yaşında`;
            } else {
                return `${years} yaş ${remainingMonths} ay`;
            }
        }
    };

    // Kılavuz değerleriyle karşılaştırma yapma
    const kilavuzKarsilastir = async (ageInMonths, values) => {
        try {
            console.log('Karşılaştırma için yaş (ay):', ageInMonths);
            console.log('Karşılaştırılacak değerler:', values);

            const sonuclar = {
                klavuz1: {},
                klavuz2: {},
                klavuz3: {},
                klavuz4: {},
                klavuz5: {}
            };

            // Her bir kılavuz için kontrol et
            for (const kilavuzAdi of Object.keys(sonuclar)) {
                const kilavuzRef = collection(db, kilavuzAdi);
                const snapshot = await getDocs(kilavuzRef);
                
                snapshot.forEach(doc => {
                    const kilavuzData = doc.data();
                    const testType = kilavuzData.type; // Örn: "IgG4"
                    const testValue = values[testType];

                    console.log(`${kilavuzAdi} - ${testType} kontrolü:`, {
                        testValue,
                        kilavuzData,
                        ageInRange: ageInMonths >= kilavuzData.min_age_months && 
                                  (kilavuzData.max_age_months === null || ageInMonths <= kilavuzData.max_age_months)
                    });

                    // Yaş aralığı kontrolü (max_age_months null ise üst sınır yok demektir)
                    if (testValue !== undefined && 
                        ageInMonths >= kilavuzData.min_age_months && 
                        (kilavuzData.max_age_months === null || ageInMonths <= kilavuzData.max_age_months)) {
                        
                        // Değer karşılaştırması
                        if (testValue < kilavuzData.min_val) {
                            sonuclar[kilavuzAdi][testType] = "düşük";
                        } else if (testValue > kilavuzData.max_val) {
                            sonuclar[kilavuzAdi][testType] = "yüksek";
                        } else {
                            sonuclar[kilavuzAdi][testType] = "normal";
                        }

                        // Referans değerlerini ekle
                        sonuclar[kilavuzAdi][`${testType}_ref`] = {
                            min: kilavuzData.min_val,
                            max: kilavuzData.max_val,
                            age_range: kilavuzData.max_age_months === null 
                                ? `${kilavuzData.min_age_months} ay ve üzeri`
                                : `${kilavuzData.min_age_months}-${kilavuzData.max_age_months} ay`
                        };
                    }
                });
            }

            console.log('Karşılaştırma sonuçları:', sonuclar);
            return sonuclar;
        } catch (error) {
            console.error('Kılavuz karşılaştırma hatası:', error);
            return {};
        }
    };

    // Hasta arama fonksiyonu
    const hastaAra = async () => {
        try {
            const q = query(collection(db, 'users'), where('fullName', '==', aramaAdi));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                Alert.alert('Hata', 'Hasta bulunamadı');
                return;
            }

            const hastaDoc = snapshot.docs[0];
            const hastaData = hastaDoc.data();
            
            if (!hastaData.birthDate) {
                Alert.alert('Hata', 'Hastanın doğum tarihi bilgisi eksik');
                return;
            }

            setBulunanHasta({
                id: hastaDoc.id,
                ...hastaData,
                ageInMonths: calculateAgeInMonths(hastaData.birthDate)
            });
        } catch (error) {
            Alert.alert('Hata', 'Hasta arama sırasında bir hata oluştu');
            console.error('Arama hatası:', error);
        }
    };

    // Tahlil kaydetme fonksiyonu
    const tahlilKaydet = async () => {
        if (!bulunanHasta) {
            Alert.alert('Hata', 'Lütfen önce bir hasta seçin');
            return;
        }

        if (!bulunanHasta.birthDate) {
            Alert.alert('Hata', 'Hastanın doğum tarihi bilgisi eksik');
            return;
        }

        // Tüm değerlerin sayı olduğundan emin oluyoruz
        const sayisalDegerler = {};
        for (const [key, value] of Object.entries(tahlilDegerleri)) {
            const sayisalDeger = parseFloat(value);
            if (isNaN(sayisalDeger)) {
                Alert.alert('Hata', `${key} için geçerli bir sayı giriniz`);
                return;
            }
            sayisalDegerler[key] = sayisalDeger;
        }

        try {
            const ageInMonths = bulunanHasta.ageInMonths;
            console.log('Yaş (ay):', ageInMonths);

            // Kılavuz değerleriyle karşılaştırma
            const karsilastirmaSonuclari = await kilavuzKarsilastir(ageInMonths, sayisalDegerler);

            // Tahlil sonuçlarını kaydet
            await addDoc(collection(db, 'tahliller'), {
                date: serverTimestamp(),
                userId: bulunanHasta.id,
                fullName: bulunanHasta.fullName,
                values: sayisalDegerler,
                ageInMonths: ageInMonths,
                formattedAge: formatAge(ageInMonths),
                birthDate: bulunanHasta.birthDate,
                karsilastirma: karsilastirmaSonuclari
            });

            Alert.alert('Başarılı', 'Tahlil sonuçları kaydedildi');
            // Form alanlarını temizle
            setTahlilDegerleri({
                IgA: '',
                IgG: '',
                IgG1: '',
                IgG2: '',
                IgG3: '',
                IgG4: '',
                IgM: ''
            });
            setBulunanHasta(null);
            setAramaAdi('');
        } catch (error) {
            console.error('Tahlil kaydetme hatası:', error);
            Alert.alert('Hata', 'Tahlil sonuçları kaydedilirken bir hata oluştu');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.aramaContainer}>
                <TextInput
                    style={styles.aramaInput}
                    placeholder="Hasta adı"
                    value={aramaAdi}
                    onChangeText={setAramaAdi}
                />
                <TouchableOpacity style={styles.aramaButton} onPress={hastaAra}>
                    <Text style={styles.buttonText}>Ara</Text>
                </TouchableOpacity>
            </View>

            {bulunanHasta && (
                <View style={styles.hastaInfo}>
                    <Text style={styles.hastaBaslik}>Seçili Hasta:</Text>
                    <Text style={styles.hastaAdi}>{bulunanHasta.fullName}</Text>
                    
                    {/* Yaş gösterimi */}
                    <Text style={styles.label}>Yaş: {formatAge(bulunanHasta.ageInMonths)}</Text>

                    {/* Tahlil değerleri girişi */}
                    {Object.keys(tahlilDegerleri).map((key) => (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={styles.label}>{key}:</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={tahlilDegerleri[key]}
                                onChangeText={(value) => setTahlilDegerleri(prev => ({
                                    ...prev,
                                    [key]: value
                                }))}
                                placeholder="0"
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.kaydetButton} onPress={tahlilKaydet}>
                        <Text style={styles.buttonText}>Tahlil Sonuçlarını Kaydet</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};


export default TahlilEkle;
