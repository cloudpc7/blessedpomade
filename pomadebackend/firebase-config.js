const admin = require('firebase-admin');
const serviceAccount = require('./blessedpomade-firebase-adminsdk-r3lp4-0713101f7b.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const FieldValue = admin.firestore.FieldValue;

module.exports = { db, FieldValue };