import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        height: 120,
        width: 120,
        alignSelf: 'center',
        margin: 30,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 48,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        width: '95%',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateButton: {
        height: 48,
        borderRadius: 20,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        width: '95%',
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
    },
    dateButtonText: {
        color: '#333',
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        width: '95%',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold",
    },
})