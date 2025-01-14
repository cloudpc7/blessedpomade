const {onRequest} = require("firebase-functions/v2/https");
const functions = require('firebase-functions');
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const {db ,admin, FieldValue} = require("./firebase-config");
const stripe = require("stripe")("sk_test_51QfVA1IMAr2rME9Pnoa5HD35bVGIDEtt3pCOcqyzE8ircVbe3YZHncAzp3LehCuKGLiBlaCUoVg7W3R5rGn9Apw700xGsuLiCm");
const app = express();
const auth = admin.auth();
const path = require('path');
// Enable Cors
app.use(cors({ origin: true}));
app.use(express.json());
app.use((req, res, next) => {
    // Temporarily relax the CSP for local testing
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

app.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || isNaN(amount)) {
        return res.status(400).send({ error: 'Invalid amount' });
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
  
      return res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

app.post("/addTransaction", async (req, res) => {
    const transactionData = req.body;
    try {
        const timestamp = FieldValue ? FieldValue.serverTimestamp() : new Date();
        const docRef = await db.collection("pomade-transactions").add({
            ...transactionData,
            createdAt: timestamp, // Correct usage of serverTimestamp
        });
        res.status(201).send({ message: "Transaction added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding transaction: ", error);
        res.status(500).send({ error: "Failed to add transaction" });
    }
});

exports.api = onRequest(app);