import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const HastaListesi = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    // Tüm hastaları çekme
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);

                const usersList = [];
                querySnapshot.forEach((doc) => {
                    usersList.push({ id: doc.id, ...doc.data() });
                });

                setUsers(usersList);
            } catch (error) {
                console.error('Hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const tahlilleriGoruntule = (hasta) => {
        navigation.navigate('Tahliller', {
            hastaId: hasta.id,
            hastaAdi: hasta.fullName
        });
    };

    const renderHastaItem = ({ item }) => (
        <View style={styles.hastaItem}>
            <View style={styles.hastaDetay}>
                <Text style={styles.hastaAdi}>{item.fullName}</Text>
                <Text style={styles.hastaBilgi}>Email: {item.email}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.tahlilButton}
                    onPress={() => tahlilleriGoruntule(item)}
                >
                    <Text style={styles.buttonText}>Tahliller</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tahlilButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => navigation.navigate('TahlilKarsilastirma', { 
                        hastaId: item.id, 
                        hastaAdi: item.fullName 
                    })}
                >
                    <Text style={styles.buttonText}>Karşılaştır</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderHastaItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};


export default HastaListesi;
