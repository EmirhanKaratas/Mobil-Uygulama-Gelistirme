import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Üstten hizalama
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 400, // İçeriği beyaz alana taşımak için
  },
  logoContainer: {
    position: 'absolute', // Konumu serbest bırakmak için
    top: '20%', // Logonun ve "Login" yazısının mavi ucunda kalması
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column', // Alt alta hizalama
    gap: 0, // Boşlukları kaldırmak için
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom:1
    // "Login" yazısından biraz boşluk
  },
  loginText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'gray',
    padding:60
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