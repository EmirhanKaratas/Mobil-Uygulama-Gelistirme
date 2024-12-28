import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const HastaListesi = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tüm hastaları çekme
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users'); // 'patients' koleksiyonundan veri al
                const querySnapshot = await getDocs(usersRef);

                const usersList = [];
                querySnapshot.forEach((doc) => {
                    usersList.push({ id: doc.id, ...doc.data() }); // Verileri kaydet
                });

                setUsers(usersList); // Hastaları state'e kaydet
            } catch (error) {
                console.error('Hata:', error);
            } finally {
                setLoading(false); // Yükleme işlemi tamamlandığında loading'i false yap
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderPatient = ({ item }) => (
        <View style={styles.patientCard}>
            <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{item.fullName}</Text>
                {/* Diğer hasta bilgilerini ekleyebilirsiniz */}
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Tahliller</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderPatient}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 10,
    },
    patientCard: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: 'gray',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row', // Hasta adı ve buton yan yana
        justifyContent: 'space-between', // Butonun sağa yaslanması
        alignItems: 'center',
    },
    patientInfo: {
        flex: 1, // Adın ve diğer bilgilerin yatayda genişlemesi için
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#4CAF50', // Butonun arka plan rengi
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff', // Buton metninin rengi
        fontWeight: 'bold',
    },
});

export default HastaListesi;
