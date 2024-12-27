import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import styles from './styles';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('hastaListesi');
  const [doctorData, setDoctorData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testResult, setTestResult] = useState({
    testName: '',
    value: '',
    unit: '',
    status: '',
    referenceRange: '',
    date: new Date().toISOString().split('T')[0]
  });

  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    checkDoctorAccess();
    fetchPatients();
  }, []);

  const checkDoctorAccess = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Oturum açmanız gerekiyor');
        navigation.replace('Login');
        return;
      }

      const doctorDoc = await getDoc(doc(db, 'doctors', user.uid));
      if (!doctorDoc.exists()) {
        Alert.alert('Hata', 'Doktor bilgileri bulunamadı');
        navigation.replace('Login');
        return;
      }

      const doctorData = doctorDoc.data();
      if (doctorData.role !== 'doctor') {
        Alert.alert('Hata', 'Bu sayfaya erişim yetkiniz yok');
        navigation.replace('Login');
        return;
      }

      setDoctorData(doctorData);
    } catch (error) {
      console.error('Doktor kontrolü hatası:', error);
      Alert.alert('Hata', 'Doktor bilgileri kontrol edilirken bir hata oluştu');
      navigation.replace('Login');
    }
  };

  const fetchPatients = async () => {
    try {
      const patientsRef = collection(db, 'users');
      const q = query(patientsRef, where('role', '==', 'user'));
      const querySnapshot = await getDocs(q);
      
      const patientsList = [];
      querySnapshot.forEach((doc) => {
        patientsList.push({ id: doc.id, ...doc.data() });
      });
      
      setPatients(patientsList);
    } catch (error) {
      Alert.alert('Hata', 'Hastalar yüklenirken bir hata oluştu');
    }
  };

  const handleAddTestResult = async () => {
    if (!selectedPatient) return;

    try {
      await addDoc(collection(db, 'testResults'), {
        ...testResult,
        userId: selectedPatient.id,
        doctorId: auth.currentUser.uid,
        createdAt: new Date()
      });

      Alert.alert('Başarılı', 'Tahlil sonucu eklendi');
      setModalVisible(false);
      setTestResult({
        testName: '',
        value: '',
        unit: '',
        status: '',
        referenceRange: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedPatient(null);
    } catch (error) {
      Alert.alert('Hata', 'Tahlil sonucu eklenirken bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
    }
  };

  const renderHastaListesi = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Hasta Listesi</Text>
      {patients.map((patient) => (
        <View key={patient.id} style={styles.patientCard}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientDetail}>TC: {patient.tcKimlik}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addTestButton}
            onPress={() => {
              setSelectedPatient(patient);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addTestButtonText}>Tahlil Ekle</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderHastaAra = () => {
    const filteredPatients = patients.filter(patient => 
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.tcKimlik?.includes(searchQuery)
    );

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Hasta Ara</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Hasta Adı veya TC Kimlik No"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredPatients.map((patient) => (
          <View key={patient.id} style={styles.patientCard}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientDetail}>TC: {patient.tcKimlik}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addTestButton}
              onPress={() => {
                setSelectedPatient(patient);
                setModalVisible(true);
              }}
            >
              <Text style={styles.addTestButtonText}>Tahlil Ekle</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderTahlilEkle = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Tahlil Ekle</Text>
      <Text style={styles.sectionSubtitle}>Lütfen önce hasta listesinden veya arama bölümünden bir hasta seçin.</Text>
    </View>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'hastaListesi':
        return renderHastaListesi();
      case 'hastaAra':
        return renderHastaAra();
      case 'tahlilEkle':
        return renderTahlilEkle();
      default:
        return renderHastaListesi();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Sol Panel */}
        <View style={styles.leftPanel}>
          <Image
            source={doctorData?.photoURL ? { uri: doctorData.photoURL } : require('../../../assets/merve.png')}
            style={styles.profileImage}
          />
          <Text style={styles.doctorName}>{doctorData?.name || 'İsimsiz Doktor'}</Text>
          <Text style={styles.doctorInfo}>{doctorData?.email}</Text>

          <TouchableOpacity 
            style={[styles.menuButton, activeSection === 'hastaListesi' && styles.activeMenuButton]}
            onPress={() => setActiveSection('hastaListesi')}
          >
            <Text style={[styles.menuButtonText, activeSection === 'hastaListesi' && styles.activeMenuButtonText]}>
              Hasta Listesi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButton, activeSection === 'hastaAra' && styles.activeMenuButton]}
            onPress={() => setActiveSection('hastaAra')}
          >
            <Text style={[styles.menuButtonText, activeSection === 'hastaAra' && styles.activeMenuButtonText]}>
              Hasta Ara
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButton, activeSection === 'tahlilEkle' && styles.activeMenuButton]}
            onPress={() => setActiveSection('tahlilEkle')}
          >
            <Text style={[styles.menuButtonText, activeSection === 'tahlilEkle' && styles.activeMenuButtonText]}>
              Tahlil Ekle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Sağ Panel */}
        <ScrollView style={styles.rightPanel}>
          {renderSection()}
        </ScrollView>
      </View>

      {/* Tahlil Ekleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tahlil Sonucu Ekle</Text>
            <Text style={styles.modalSubtitle}>
              Hasta: {selectedPatient?.name}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Tahlil Adı"
              value={testResult.testName}
              onChangeText={(text) => setTestResult({...testResult, testName: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Değer"
              value={testResult.value}
              onChangeText={(text) => setTestResult({...testResult, value: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Birim"
              value={testResult.unit}
              onChangeText={(text) => setTestResult({...testResult, unit: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Durum (Normal/Anormal)"
              value={testResult.status}
              onChangeText={(text) => setTestResult({...testResult, status: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Referans Aralığı"
              value={testResult.referenceRange}
              onChangeText={(text) => setTestResult({...testResult, referenceRange: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Tarih (YYYY-MM-DD)"
              value={testResult.date}
              onChangeText={(text) => setTestResult({...testResult, date: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTestResult}
              >
                <Text style={styles.modalButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminPanel;
