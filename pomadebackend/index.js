const dotenv = require('dotenv');
const {onRequest} = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const {db ,admin, FieldValue} = require("./firebase-config");
const app = express();
const auth = admin.auth();
const path = require('path');

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
// Enable Cors
app.use(cors({ origin: true}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self';");
    next();
});

// app.use(express.static(path.join(__dirname, 'build'))); for use when deploying to production
// app.get('*', (req,res) => {
//     res.sendfile(path.join(__dirname, 'build', 'index.html'));
// });

// express routes

app.get("/transactions", async (req,res) => {
    try {
        const snapshot = await db.collection("transactions").get();
        const transactions = snapshot.docs.map(doc => doc.data());
        res.status(200).send(transactions);
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        res.status(500).send({ error: "Failed to fetch transactions" });
    }
});

app.get("/googleMaps", (req,res) => {
  res.json({
    googleKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
});

app.get("/gateway", (req,res) => {
  res.json({
    publishKey: process.env.STRIPE,
  });
});

app.get("/stripe", (req,res) => {
  res.json({
    secretKey: process.env.STRIPE_KEY,
  })
})


app.post('/createpaymentintent', async (req, res) => {
  try {
    const amount = req.body.amount || 1000;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret});
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intetn'});
  }
});

app.post("/addTransaction", async (req, res) => {
    const transactionData = req.body;
    try {
        const timestamp = FieldValue ? FieldValue.serverTimestamp() : new Date();
        const docRef = await db.collection("pomade-transactions").add({
            ...transactionData,
            createdAt: timestamp,
        });
        res.status(201).send({ message: "Transaction added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding transaction: ", error);
        res.status(500).send({ error: "Failed to add transaction" });
    }
});

exports.api = functions.https.onRequest(app);