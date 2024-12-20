import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
      },
      sidePanel: {
        width: 250,
        backgroundColor: '#333',
        padding: 20,
        justifyContent: 'flex-start',
      },
      profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
      },
      profileName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      sideButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
      },
      sideButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },
      mainContent: {
        flex: 1,
        padding: 20,
      },
      heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#4A90E2',
        fontFamily: 'Roboto',
      },
      label: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'Roboto',
      },
      picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Roboto',
        marginBottom: 15,
      },
      input: {
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto',
      },
      button: {
        backgroundColor: '#4A90E2',
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Roboto',
      },
      logoutButton: {
        backgroundColor: '#E74C3C',  // Çıkış yap butonuna kırmızı renk
        padding: 15,
        borderRadius: 8,
        marginTop: 'auto',  // Butonu en alt kısma yerleştirir
      },
      result: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 16,
        color: '#333',
      },
  });