import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    updateButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
