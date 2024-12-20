import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
      },
      container: {
        flex: 1,
        justifyContent: 'flex-start', // Üstten hizalama
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 450, // İçeriği beyaz alana taşımak için
      },
      logoContainer: {
        position: 'absolute', // Konumu serbest bırakmak için
        top: '25%', // Logonun ve "Login" yazısının mavi ucunda kalması
        alignItems: 'center',
        width: '100%',
      },
      logo: {
        width: 100,
        height: 100,
         // "Login" yazısından biraz boşluk
      },
      loginText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff', // Beyaz yazı rengi
      },
      input: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      button: {
        width: '80%',
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      }
})