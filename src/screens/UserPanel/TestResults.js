import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialIcons kütüphanesi import edildi

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

export default function TestResults({ route }) {
  const { tahlil } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            // Değer, durum ve referansları ayır
            const deger = tahlil.values[testAdi];
            const durum = testler[testAdi]; // Örneğin: 'düşük', 'normal', 'yüksek'
            const referans = testler[`${testAdi}_ref`]; // Referans aralığı (min, max)

            // Eğer bu test için değer ve referans yoksa, gösterme
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:30
  },
  detailBox: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  detailValue: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  resultBox: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  resultLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  resultValue: {
    flex: 1,
  },
  klavuzBox: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  klavuzHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  klavuzDetailBox: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  klavuzLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  klavuzValue: {
    flex: 1,
  },
  referansText: {
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 120, // Değerle hizalı görünüm
    fontSize:12
  },
});
