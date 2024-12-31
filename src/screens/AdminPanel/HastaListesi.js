import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hastaItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    hastaDetay: {
        flex: 1,
    },
    hastaAdi: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    hastaBilgi: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tahlilButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default HastaListesi;
