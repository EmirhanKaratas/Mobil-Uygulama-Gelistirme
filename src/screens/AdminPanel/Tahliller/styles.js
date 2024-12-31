import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    baslik: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    tahlilCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tarih: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
    },
    kilavuzContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    kilavuzBaslik: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    degerlerContainer: {
        marginLeft: 8,
    },
    degerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    degerBilgi: {
        flex: 1,
        marginRight: 8,
    },
    degerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 4,
    },
    degerValue: {
        fontSize: 14,
        color: '#333',
    },
    referansText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    yasAralik: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    }
})