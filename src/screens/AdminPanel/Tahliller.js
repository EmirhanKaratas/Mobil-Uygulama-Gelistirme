import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { MaterialIcons } from '@expo/vector-icons';

const KarsilastirmaIkonu = ({ durum }) => {
    switch (durum) {
        case 'düşük':
            return <MaterialIcons name="arrow-downward" size={24} color="red" />;
        case 'yüksek':
            return <MaterialIcons name="arrow-upward" size={24} color="green" />;
        case 'normal':
            return <MaterialIcons name="arrow-forward" size={24} color="gray" />;
        default:
            return null;
    }
};

const Tahliller = ({ route }) => {
    const { hastaId, hastaAdi } = route.params;
    const [tahliller, setTahliller] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tahlilleriGetir = async () => {
            try {
                const q = query(
                    collection(db, 'tahliller'),
                    where('userId', '==', hastaId)
                );
                const querySnapshot = await getDocs(q);
                
                const tahlilListesi = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const tarih = data.date ? new Date(data.date.toDate()).toLocaleString('tr-TR') : 'Tarih belirtilmemiş';
                    
                    tahlilListesi.push({
                        id: doc.id,
                        tarih: tarih,
                        ...data
                    });
                });

                // Tarihe göre sırala (en yeni en üstte)
                tahlilListesi.sort((a, b) => {
                    if (!a.date || !b.date) return 0;
                    return b.date.toDate() - a.date.toDate();
                });

                console.log('Tahlil listesi:', JSON.stringify(tahlilListesi, null, 2));
                setTahliller(tahlilListesi);
            } catch (error) {
                console.error('Tahliller getirilirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        tahlilleriGetir();
    }, [hastaId]);

    const renderKilavuzSonuclari = (tahlil, kilavuzAdi) => {
        console.log(`${kilavuzAdi} sonuçları:`, tahlil.karsilastirma?.[kilavuzAdi]);
        
        if (!tahlil.karsilastirma || !tahlil.karsilastirma[kilavuzAdi]) {
            console.log(`${kilavuzAdi} için sonuç bulunamadı`);
            return null;
        }

        const karsilastirma = tahlil.karsilastirma[kilavuzAdi];
        const testler = Object.keys(karsilastirma).filter(key => !key.endsWith('_ref'));

        if (testler.length === 0) {
            console.log(`${kilavuzAdi} için test sonucu bulunamadı`);
            return null;
        }

        return (
            <View style={styles.kilavuzContainer}>
                <Text style={styles.kilavuzBaslik}>{kilavuzAdi.toUpperCase()}</Text>
                <View style={styles.degerlerContainer}>
                    {testler.map(testAdi => {
                        const deger = tahlil.values[testAdi];
                        const durum = karsilastirma[testAdi];
                        const referans = karsilastirma[`${testAdi}_ref`];

                        if (!deger || !durum || !referans) return null;

                        return (
                            <View key={testAdi} style={styles.degerRow}>
                                <View style={styles.degerBilgi}>
                                    <Text style={styles.degerLabel}>{testAdi}:</Text>
                                    <Text style={styles.degerValue}>
                                        {deger} 
                                        <Text style={styles.referansText}>
                                            {` (Ref: ${referans.min}-${referans.max})`}
                                        </Text>
                                        {referans.age_range && (
                                            <Text style={styles.yasAralik}>
                                                {`\nYaş aralığı: ${referans.age_range}`}
                                            </Text>
                                        )}
                                    </Text>
                                </View>
                                <KarsilastirmaIkonu durum={durum} />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.baslik}>{hastaAdi} - Tahlil Sonuçları</Text>
            
            {tahliller.length === 0 ? (
                <Text style={styles.noData}>Henüz tahlil sonucu bulunmamaktadır.</Text>
            ) : (
                tahliller.map((tahlil) => (
                    <View key={tahlil.id} style={styles.tahlilCard}>
                        <Text style={styles.tarih}>Tarih: {tahlil.tarih}</Text>
                        {renderKilavuzSonuclari(tahlil, 'klavuz1')}
                        {renderKilavuzSonuclari(tahlil, 'klavuz2')}
                        {renderKilavuzSonuclari(tahlil, 'klavuz3')}
                        {renderKilavuzSonuclari(tahlil, 'klavuz4')}
                        {renderKilavuzSonuclari(tahlil, 'klavuz5')}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    baslik: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    tahlilCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tarih: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
    },
    kilavuzContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    kilavuzBaslik: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    degerlerContainer: {
        marginLeft: 8,
    },
    degerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    degerBilgi: {
        flex: 1,
        marginRight: 8,
    },
    degerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 4,
    },
    degerValue: {
        fontSize: 14,
        color: '#333',
    },
    referansText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    yasAralik: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    }
});

export default Tahliller;
