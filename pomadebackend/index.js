const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const {onRequest} = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const logger = require("firebase-functions/logger");
const {db ,admin } = require("./firebase-config");
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self';");
  next();
});

// Your routes
app.get('/payment-page', (req, res) => {
});

exports.api = functions.https.onRequest(app);