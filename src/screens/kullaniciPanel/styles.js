import { StyleSheet } from 'react-native';

export const userPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  leftPanel: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  rightPanel: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export const testResultsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  referenceRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
