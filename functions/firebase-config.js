// functions/firebase-config.js
const admin = require("firebase-admin");
const serviceAccount = require("./blessedpomadeAdmin.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();

module.exports = {admin, db};
