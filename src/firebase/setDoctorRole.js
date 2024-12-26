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
    console.log(`Doktor rolü ${uid} kullanıcısına başarıyla eklendi`);
  } catch (error) {
    console.error(`Hata ${uid} kullanıcısı için rol eklerken:`, error);
  }
};

// Birden fazla kullanıcıya rol ekleme
const addRolesToMultipleUsers = () => {
  const uids = [
    '6VXdVbhlTcX5C3RlMVrQcnk9r5v1',  // Birinci doktor UID Admin1
    'TfkaE7lgDCSzcyaXlUVW6L7saG52'   // İkinci doktor UID Admin2
  ];

  uids.forEach(uid => {
    setDoctorRole(uid);  // Her bir kullanıcı için setDoctorRole fonksiyonunu çağır
  });
};

// Kullanıcılara rol ekleme işlemi
addRolesToMultipleUsers();
