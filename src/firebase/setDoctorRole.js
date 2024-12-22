// setDoctorRole.js dosyası

const admin = require('firebase-admin');
const serviceAccount = require('../firebase/fir-mobile-project-4830f-firebase-adminsdk-mfaup-afcd49cb85.json');  // Firebase Service Account Key dosyasının yolu

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Custom claim (rol) ekleme fonksiyonu
const setDoctorRole = async (uid) => {
  try {
    // Kullanıcıya 'doctor' rolü ekle
    await admin.auth().setCustomUserClaims(uid, { role: 'doctor' });
    console.log('Role successfully added');
  } catch (error) {
    console.error('Error setting custom claim', error);
  }
};

// Örnek: Doktor UID'si ile role ekle
setDoctorRole('6VXdVbhlTcX5C3RlMVrQcnk9r5v1');  // Burada UID'yi kendi doktor kullanıcı UID'niz ile değiştirin
