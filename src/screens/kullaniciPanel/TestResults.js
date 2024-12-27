import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { testResultsStyles as styles } from './styles';

const TestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const db = getFirestore();
        const testResultsRef = collection(db, 'testResults');
        const q = query(testResultsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        
        setTestResults(results.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      Alert.alert('Hata', 'Tahlil sonuçları alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'iyi':
      case 'normal':
        return '#4CAF50';
      case 'kötü':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tahlil Sonuçlarım</Text>
      {testResults.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Henüz tahlil sonucu bulunmamaktadır.</Text>
        </View>
      ) : (
        testResults.map((test) => (
          <View key={test.id} style={styles.resultCard}>
            <Text style={styles.testName}>{test.testName}</Text>
            <View style={styles.resultDetails}>
              <Text style={styles.value}>
                {test.value} {test.unit}
              </Text>
              <Text style={[styles.status, { color: getStatusColor(test.status) }]}>
                {test.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.referenceRange}>
              Referans Aralığı: {test.referenceRange || 'Belirtilmemiş'}
            </Text>
            <Text style={styles.date}>{new Date(test.date).toLocaleDateString('tr-TR')}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default TestResults;
