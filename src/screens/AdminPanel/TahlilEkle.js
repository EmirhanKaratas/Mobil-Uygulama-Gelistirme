import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const TahlilEkle = () => {
    const [aramaAdi, setAramaAdi] = useState('');
    const [bulunanHasta, setBulunanHasta] = useState(null);
    const [hastaYas, setHastaYas] = useState(''); 
    const [tahlilDegerleri, setTahlilDegerleri] = useState({
        IgA: '',
        IgG: '',
        IgG1: '',
        IgG2: '',
        IgG3: '',
        IgG4: '',
        IgM: ''
    });

    // Kılavuz değerleriyle karşılaştırma yapma
    const kilavuzKarsilastir = async (ageInMonths, values) => {
        try {
            console.log('Karşılaştırma için yaş (ay):', ageInMonths);
            console.log('Karşılaştırılacak değerler:', values);

            const sonuclar = {
                klavuz1: {},
                klavuz2: {},
                klavuz3: {}
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
            setBulunanHasta({
                id: hastaDoc.id,
                ...hastaData
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

        if (!hastaYas) {
            Alert.alert('Hata', 'Lütfen hastanın yaşını girin');
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
            // Yaşı aya çevir
            const ageInMonths = parseFloat(hastaYas) * 12;
            console.log('Yaş (yıl):', hastaYas, 'Yaş (ay):', ageInMonths);

            if (isNaN(ageInMonths)) {
                Alert.alert('Hata', 'Geçerli bir yaş giriniz');
                return;
            }

            // Kılavuz değerleriyle karşılaştırma
            const karsilastirmaSonuclari = await kilavuzKarsilastir(ageInMonths, sayisalDegerler);

            // Tahlil sonuçlarını kaydet
            await addDoc(collection(db, 'tahliller'), {
                date: serverTimestamp(),
                userId: bulunanHasta.id,
                fullName: bulunanHasta.fullName,
                values: sayisalDegerler,
                ageInMonths: ageInMonths,
                karsilastirma: karsilastirmaSonuclari
            });

            Alert.alert('Başarılı', 'Tahlil sonuçları başarıyla kaydedildi');
            
            // Formu temizle
            setBulunanHasta(null);
            setAramaAdi('');
            setHastaYas('');
            setTahlilDegerleri({
                IgA: '',
                IgG: '',
                IgG1: '',
                IgG2: '',
                IgG3: '',
                IgG4: '',
                IgM: ''
            });
        } catch (error) {
            Alert.alert('Hata', 'Tahlil kaydedilirken bir hata oluştu');
            console.error('Kaydetme hatası:', error);
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
                    
                    {/* Yaş girişi */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Yaş (yıl):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={hastaYas}
                            onChangeText={setHastaYas}
                            placeholder="Yaş"
                        />
                    </View>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    aramaContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    aramaInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    aramaButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
    },
    hastaInfo: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    hastaBaslik: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    hastaAdi: {
        fontSize: 16,
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 80,
        fontSize: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
    },
    kaydetButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TahlilEkle;
