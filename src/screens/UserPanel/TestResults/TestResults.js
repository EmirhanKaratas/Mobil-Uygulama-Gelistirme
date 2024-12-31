import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialIcons kütüphanesi import edildi
import styles from './styles';

const KarsilastirmaIkonu = ({ durum }) => {
  switch (durum) {
    case 'düşük':
      return <MaterialIcons name="arrow-downward" size={20} color="red" />;
    case 'yüksek':
      return <MaterialIcons name="arrow-upward" size={20} color="green" />;
    case 'normal':
      return <MaterialIcons name="arrow-forward" size={20} color="gold" />;
    default:
      return null;
  }
};

export default function TestResults({ route, navigation }) {
  const { tahlil } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Geri Düğmesi */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('UserPanel')}>
        <MaterialIcons name="arrow-back" size={32} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Tahlil Detayları</Text>
      <View style={styles.detailBox}>
        <Text style={styles.detailLabel}>Ad Soyad:</Text>
        <Text style={styles.detailValue}>{tahlil.fullName}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.detailLabel}>Doğum Tarihi:</Text>
        <Text style={styles.detailValue}>
          {new Date(tahlil.birthDate.seconds * 1000).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.detailLabel}>Tarih:</Text>
        <Text style={styles.detailValue}>
          {new Date(tahlil.date.seconds * 1000).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Sonuçlar:</Text>
      {Object.entries(tahlil.values).map(([key, value]) => (
        <View key={key} style={styles.resultBox}>
          <Text style={styles.resultLabel}>{key}:</Text>
          <Text style={styles.resultValue}>{value}</Text>
        </View>
      ))}

      <Text style={styles.sectionHeader}>Karşılaştırmalar:</Text>
      {Object.entries(tahlil.karsilastirma).map(([klavuzAdi, testler]) => (
        <View key={klavuzAdi} style={styles.klavuzBox}>
          <Text style={styles.klavuzHeader}>{klavuzAdi.toUpperCase()}</Text>
          {Object.keys(testler).filter(testAdi => !testAdi.endsWith('_ref')).map((testAdi) => {
            const deger = tahlil.values[testAdi];
            const durum = testler[testAdi];
            const referans = testler[`${testAdi}_ref`];

            if (!deger || !referans) {
              return null;
            }

            return (
              <View key={testAdi} style={styles.klavuzDetailBox}>
                <View style={styles.row}>
                  <Text style={styles.klavuzLabel}>{testAdi}:</Text>
                  <Text style={styles.klavuzValue}>
                    <KarsilastirmaIkonu durum={durum} /> {deger}
                  </Text>
                </View>
                <Text style={styles.referansText}>
                  Ref: {referans.min} - {referans.max}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

