import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const DegisimIkonu = ({ oncekiDeger, simdikiDeger }) => {
  // Sayısal değerlere çevir
  const onceki = parseFloat(oncekiDeger);
  const simdiki = parseFloat(simdikiDeger);
  
  if (!isNaN(onceki) && !isNaN(simdiki)) {
    if (simdiki === onceki) {
      return <MaterialIcons name="trending-flat" size={24} color="#9E9E9E" />;
    } else if (simdiki > onceki) {
      return <MaterialIcons name="trending-up" size={24} color="#FF9800" />;
    }
    return <MaterialIcons name="trending-down" size={24} color="#F44336" />;
  }
  
  // Sayısal karşılaştırma yapılamazsa yatay ok göster
  return <MaterialIcons name="trending-flat" size={24} color="#9E9E9E" />;
};

const TahlilKarsilastirma = ({ route, navigation }) => {
  const { hastaId, hastaAdi } = route.params;
  const [tahliller, setTahliller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [karsilastirma, setKarsilastirma] = useState({});

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
          tahlilListesi.push({
            id: doc.id,
            tarih: new Date(data.date.seconds * 1000).toLocaleDateString('tr-TR'),
            tarihObj: new Date(data.date.seconds * 1000),
            ...data
          });
        });

        tahlilListesi.sort((a, b) => b.tarihObj - a.tarihObj);
        setTahliller(tahlilListesi);
        
        if (tahlilListesi.length >= 2) {
          const karsilastirmaSonuclari = {};
            
          // Sadece son iki tahlili al
          const simdiki = tahlilListesi[0]; // En son tahlil
          const onceki = tahlilListesi[1];  // Bir önceki tahlil
            
          // Her kılavuz için ayrı karşılaştırma yap
          ['klavuz1', 'klavuz2', 'klavuz3', 'klavuz4', 'klavuz5'].forEach(kilavuzAdi => {
            if (!karsilastirmaSonuclari[kilavuzAdi]) {
              karsilastirmaSonuclari[kilavuzAdi] = [];
            }

            // Önceki ve şimdiki değerlendirmeleri al
            const oncekiDegerlendirme = onceki.karsilastirma?.[kilavuzAdi] || {};
            const simdikiDegerlendirme = simdiki.karsilastirma?.[kilavuzAdi] || {};
            
            // Her test tipi için değişimleri kontrol et
            Object.keys(oncekiDegerlendirme).forEach(testTipi => {
              // _ref ile biten referans alanlarını atla
              if (testTipi.endsWith('_ref')) return;
              
              const oncekiDurum = oncekiDegerlendirme[testTipi];
              const simdikiDurum = simdikiDegerlendirme[testTipi];
              
              // Eğer her iki tahlilde de bu test tipi için değerlendirme varsa
              if (oncekiDurum && simdikiDurum) {
                karsilastirmaSonuclari[kilavuzAdi].push({
                  testTipi,
                  oncekiDurum,
                  simdikiDurum,
                  tarihler: {
                    onceki: onceki.tarih,
                    simdiki: simdiki.tarih
                  },
                  degerler: {
                    onceki: onceki.values[testTipi],
                    simdiki: simdiki.values[testTipi]
                  }
                });
              }
            });
          });
            
          setKarsilastirma(karsilastirmaSonuclari);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Tahlil getirme hatası:', error);
        setLoading(false);
      }
    };

    tahlilleriGetir();
  }, [hastaId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (tahliller.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.baslik}>{hastaAdi}</Text>
        <Text style={styles.uyariText}>
          Karşılaştırma yapabilmek için en az 2 tahlil sonucu gereklidir.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.baslik}>{hastaAdi}</Text>
      <Text style={styles.altBaslik}>Tahlil Değişim Analizi</Text>

      {Object.entries(karsilastirma).map(([kilavuzAdi, degisimler]) => (
        <View key={kilavuzAdi} style={styles.kilavuzGrubu}>
          <Text style={styles.kilavuzBaslik}>{kilavuzAdi}</Text>
          
          {degisimler.map((degisim, index) => (
            <View key={index} style={styles.degisimKutusu}>
              <View style={styles.degisimBaslik}>
                <Text style={styles.testTipi}>{degisim.testTipi}</Text>
                <Text style={styles.tarihText}>
                  {degisim.tarihler.onceki} → {degisim.tarihler.simdiki}
                </Text>
              </View>
              
              <View style={styles.degerlerSatiri}>
                <View style={styles.degerGrup}>
                  <Text style={[
                    styles.durumText,
                    {
                      color: degisim.oncekiDurum === 'normal' ? '#4CAF50' : 
                            degisim.oncekiDurum === 'düşük' ? '#F44336' : '#FF9800'
                    }
                  ]}>
                    {degisim.degerler.onceki} ({degisim.oncekiDurum})
                  </Text>
                  <Text style={styles.durumAciklama}>Önceki</Text>
                </View>

                <DegisimIkonu 
                  oncekiDeger={degisim.degerler.onceki}
                  simdikiDeger={degisim.degerler.simdiki}
                />

                <View style={styles.degerGrup}>
                  <Text style={[
                    styles.durumText,
                    {
                      color: degisim.simdikiDurum === 'normal' ? '#4CAF50' : 
                            degisim.simdikiDurum === 'düşük' ? '#F44336' : '#FF9800'
                    }
                  ]}>
                    {degisim.degerler.simdiki} ({degisim.simdikiDurum})
                  </Text>
                  <Text style={styles.durumAciklama}>Şimdiki</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};


export default TahlilKarsilastirma;
