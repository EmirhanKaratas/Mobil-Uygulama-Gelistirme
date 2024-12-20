import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
const AdminPanel = () => {
    const navigation = useNavigation();
  const [guideData, setGuideData] = useState({
    igg: '',
    igg1: '',
    igg2: '',
    igg3: '',
    igg4: '',
    igaA1: '',
    igaA2: '',
    igm: '',
  });
  const [age, setAge] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [selectedField, setSelectedField] = useState('');

  const handleInputChange = (name, value) => {
    setGuideData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createGuide = () => {
    if (!selectedAgeRange) {
      alert('Lütfen bir yaş aralığı seçin.');
      return;
    }

    alert(`${selectedAgeRange} için kılavuz oluşturuldu`);
    setGuideData({
      igg: '',
      igg1: '',
      igg2: '',
      igg3: '',
      igg4: '',
      igaA1: '',
      igaA2: '',
      igm: '',
    });
  };
  const logout = () => {
    // Çıkış yapıldığında giriş ekranına yönlendirir
    navigation.navigate('Login');  // 'Login' yerine giriş ekranınızın ismini yazmalısınız
  };

  const searchValues = () => {
    const results = [
      { key: 'IgA: 120 mg/dL' },
      { key: 'IgM: 98 mg/dL' },
    ];
    setSearchResults(results);
  };

  const trackPatient = () => {
    const data = [
      { key: '2023-12-01: IgA: 110 mg/dL' },
      { key: '2023-12-10: IgA: 120 mg/dL (↑)' },
    ];
    setPatientData(data);
  };

  const handleFieldSelection = (field) => {
    setSelectedField(field);
  };

  return (
    <View style={styles.container}>
      {/* Sol Panel */}
      <View style={styles.sidePanel}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../../assets/emirhan.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Emirhan Karataş</Text>
        </View>

        <TouchableOpacity style={styles.sideButton} onPress={() => handleFieldSelection('CreateGuide')}>
          <Text style={styles.sideButtonText}>Kılavuz Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={() => handleFieldSelection('Search')}>
          <Text style={styles.sideButtonText}>Değer Ara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={() => handleFieldSelection('TrackPatient')}>
          <Text style={styles.sideButtonText}>Hasta Takibi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Ana İçerik Alanı */}
      <ScrollView style={styles.mainContent}>
        <Text style={styles.heading}>Yönetici Paneli</Text>

        {/* Kılavuz Oluşturma */}
        {selectedField === 'CreateGuide' && (
          <>
            {/* Yaş Aralığı Seçimi */}
            <Text style={styles.label}>Yaş Aralığı Seçin (Ay,Yıl):</Text>
            <Picker
              selectedValue={selectedAgeRange}
              onValueChange={(itemValue) => setSelectedAgeRange(itemValue)}
              style={styles.picker}>
              <Picker.Item label="0-5 Ay" value="0-5" />
              <Picker.Item label="5-9 Ay" value="5-9" />
              <Picker.Item label="9-12 Ay" value="9-15" />
              <Picker.Item label="12-24 Ay" value="15-24" />
              <Picker.Item label="2-4 Yaş" value="2-4" />
              <Picker.Item label="4-7 Yaş" value="4-7" />
              <Picker.Item label="7-10 Yaş" value="7-10" />
              <Picker.Item label="10-13 Yaş" value="10-13" />
              <Picker.Item label="13-16 Yaş" value="13-16" />
              <Picker.Item label="16-18 Yaş" value="16-18" />
              <Picker.Item label=">18 Yaş" value="18" />
              
            </Picker>

            {/* Ig Değerleri */}
            <TextInput
              style={styles.input}
              placeholder="IgG g/L"
              value={guideData.igg}
              onChangeText={(text) => handleInputChange('igg', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgG1 g/L"
              value={guideData.igg1}
              onChangeText={(text) => handleInputChange('igg1', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgG2 g/L"
              value={guideData.igg2}
              onChangeText={(text) => handleInputChange('igg2', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgG3 g/L"
              value={guideData.igg3}
              onChangeText={(text) => handleInputChange('igg3', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgG4 g/L"
              value={guideData.igg4}
              onChangeText={(text) => handleInputChange('igg4', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgA g/L (A1)"
              value={guideData.igaA1}
              onChangeText={(text) => handleInputChange('igaA1', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgA2 g/L"
              value={guideData.igaA2}
              onChangeText={(text) => handleInputChange('igaA2', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="IgM g/L"
              value={guideData.igm}
              onChangeText={(text) => handleInputChange('igm', text)}
            />
            <TouchableOpacity style={styles.button} onPress={createGuide}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Değer Arama */}
        {selectedField === 'Search' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Yaş"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
            <TouchableOpacity style={styles.button} onPress={searchValues}>
              <Text style={styles.buttonText}>Değer Ara</Text>
            </TouchableOpacity>
            <FlatList
              data={searchResults}
              renderItem={({ item }) => <Text style={styles.result}>{item.key}</Text>}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        )}

        {/* Hasta Takibi */}
        {selectedField === 'TrackPatient' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Hasta Adı Soyadı"
              value={patientName}
              onChangeText={setPatientName}
            />
            <TouchableOpacity style={styles.button} onPress={trackPatient}>
              <Text style={styles.buttonText}>Hasta Takibi</Text>
            </TouchableOpacity>
            <FlatList
              data={patientData}
              renderItem={({ item }) => <Text style={styles.result}>{item.key}</Text>}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};



export default AdminPanel;
