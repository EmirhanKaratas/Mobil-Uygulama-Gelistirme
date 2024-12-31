import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    baslik: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 40,
    },
    altBaslik: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    uyariText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    kilavuzGrubu: {
        marginBottom: 24,
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
    },
    kilavuzBaslik: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
        textTransform: 'capitalize',
    },
    degisimKutusu: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 2,
    },
    degisimBaslik: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    testTipi: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    tarihText: {
        fontSize: 14,
        color: '#666',
    },
    degerlerSatiri: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    degerGrup: {
        alignItems: 'center',
    },
    durumText: {
        fontSize: 16,
        fontWeight: '500',
    },
    durumAciklama: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
})