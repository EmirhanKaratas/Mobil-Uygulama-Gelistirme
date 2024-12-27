import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    color: 'gray',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    //fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },
  userText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center'
  },
  user_list: {
  },
  userItem: {
    borderWidth: 0.5,
    padding: 5,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: 'lightgrey',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center', // Yatayda ortalamak için
    alignSelf: 'center',
  }
})