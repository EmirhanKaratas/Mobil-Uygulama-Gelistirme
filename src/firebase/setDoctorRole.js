const admin = require('firebase-admin');
const serviceAccount = require('../firebase/fir-mobile-project-4830f-firebase-adminsdk-mfaup-afcd49cb85.json');

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Custom claim (rol) ekleme fonksiyonu - Doktor
const setDoctorRole = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'doctor' });
    console.log(`Doktor rolü ${uid} kullanıcısına başarıyla eklendi`);
  } catch (error) {
    console.error(`Hata ${uid} kullanıcısı için rol eklerken:`, error);
  }
};

// Custom claim (rol) ekleme fonksiyonu - Hasta
const setHastaRole = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'user' });
    console.log(`Hasta rolü ${uid} kullanıcısına başarıyla eklendi`);
  } catch (error) {
    console.error(`Hata ${uid} kullanıcısı için rol eklerken:`, error);
  }
};

// Kullanıcı listeleri doktor ve hasta
const doctorUIDs = [
  '6VXdVbhlTcX5C3RlMVrQcnk9r5v1',
  'TfkaE7lgDCSzcyaXlUVW6L7saG52',
];

const hastaUIDs = [
  'iAD8lWA4V2acpezVHfMVbqhrrPk2',
  '0R6p91Tm3gTcoq2gfVbFZArNkqf1',
];

// Roller ekleniyor
const addRoles = async () => {
  doctorUIDs.forEach((uid) => setDoctorRole(uid));
  hastaUIDs.forEach((uid) => setHastaRole(uid));
};

addRoles();
