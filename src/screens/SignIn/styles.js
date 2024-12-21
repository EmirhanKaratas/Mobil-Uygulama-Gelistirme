
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center'
    },
    title: {

    },
    background: {
        flex: 1,
        width: '100%',
        height: '80%',
        justifyContent: 'center',
    },
    
    logo: {
        flex: 1,
        height: 150,
        width: 150,
        alignSelf: "center",
        margin: 80
    },
    input: {
        height: 48,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#007BFF',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#007BFF",
        fontWeight: "bold",
        fontSize: 16
    }
})
