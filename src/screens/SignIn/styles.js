import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        alignContent:'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Daha modern bir arka plan rengi
        padding: 20, // Kenarlara daha fazla boşluk için padding
    },
    logo: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#788eec', // Logo etrafına çerçeve
        marginBottom: 30, // Logonun altındaki alanı genişlet
        margin:'auto',
        marginTop:100
    },
    input: {
        height: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: 10,
        paddingLeft: 16,
        width: '80%', // Ekranda daha iyi hizalama için genişlik
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5, // Android için gölge efekti
        margin:'auto'
    },
    dateButton: {
        height: 50,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
        paddingLeft: 16,
        width: '80%', // Ekranda daha iyi hizalama için genişlik
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5, // Android için gölge efekti
        margin:'auto'
    },
    dateButtonText: {
        color: '#333',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#788eec',
        marginTop: 20,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: 'center',
        width: '80%', // Ekranda daha iyi hizalama için genişlik
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8, // Android için gölge efekti
        margin:'auto'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold",
    },
    footerView: {
        flexDirection: 'row',
        marginTop: 30, // Footer'ı daha yukarıda tutmak için margin
        alignItems: 'center',
        margin:'auto'
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d',
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 5,
    },
});
