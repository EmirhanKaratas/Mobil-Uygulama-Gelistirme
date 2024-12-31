import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 25
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 5,
        color: 'black',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
        marginLeft: 120,
        fontSize: 12,
    },
})