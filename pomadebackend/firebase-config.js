const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

if (process.env.FIRESTORE_EMULATOR_HOST) {
    const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST.split(':')[0];
    const firestorePort = process.env.FIRESTORE_EMULATOR_HOST.split(':')[1];
    admin.firestore().settings({
        host: `${firestoreHost}:${firestorePort}`,
        ssl: false,  // Emulator doesn't use SSL
    });
} else {
    // Optional: If you want to force the emulator connection when not using an environment variable
    // Directly configure it when running locally without environment variable
    admin.firestore().settings({
        host: 'localhost:8080',  // Point to the Firestore emulator
        ssl: false,
    });
}

const FieldValue = admin.firestore.FieldValue;

module.exports = { db, admin, FieldValue };