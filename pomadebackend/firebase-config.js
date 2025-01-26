const admin = require('firebase-admin');
const serviceAccount = require("../src");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

if (process.env.FIRESTORE_EMULATOR_HOST) {
    const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST.split(':')[0];
    const firestorePort = process.env.FIRESTORE_EMULATOR_HOST.split(':')[1];
    admin.firestore().settings({
        host: `${firestoreHost}:${firestorePort}`,
        ssl: false, 
    });
} else {
    admin.firestore().settings({
        host: 'localhost:8080',
        ssl: false,
    });
}

const FieldValue = admin.firestore.FieldValue;

module.exports = { db, admin, FieldValue };