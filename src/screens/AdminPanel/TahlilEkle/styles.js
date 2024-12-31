import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    aramaContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    aramaInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    aramaButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
    },
    hastaInfo: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
    },
    hastaBaslik: {
        fontSize: 16,
        fontWeight: 'bold',
        margin:8
    },
    hastaAdi: {
        fontSize: 16,
        margin: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 80,
        fontSize: 16,
        margin:8
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
    },
    kaydetButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginTop:8
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})