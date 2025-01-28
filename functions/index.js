const dotenv = require("dotenv");
dotenv.config();
const admin = require("firebase-admin");
const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const serviceAccount = require("./blessedpomadeAdmin.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
app.use(cors({origin: true}));
app.use(express.json());

// Function to generate a session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Middleware to initialize session or provide a new session token
let sessionCreationCount = 0;
app.use(async (req, res, next) => {
  let sessionToken = req.headers['session-token'];
  if (!sessionToken) {
    try {
      sessionToken = generateSessionToken();
      await db.collection('sessions').doc(sessionToken).set({
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiration
      });
      res.header('Session-Token', sessionToken); // Send session token back to client
      sessionCreationCount++;
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create session' });
    }
  } else {
    // Check if the session token is valid
    try {
      const session = await db.collection('sessions').doc(sessionToken).get();
      if (!session.exists || new Date(session.data().expiresAt) < new Date()) {
        // Session expired or invalid, generate new one
        sessionToken = generateSessionToken();
        await db.collection('sessions').doc(sessionToken).set({
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
        res.header('Session-Token', sessionToken); // Send new session token back to client
        if (session.exists) await session.ref.delete(); // Delete old session if exists
      }
    } catch (error) {
      console.error('Error validating session:', error);
      return res.status(500).json({ error: 'Failed to validate session' });
    }
  }
  
  req.sessionToken = sessionToken; // Attach to request for use in subsequent middleware/routes
  next();
});

app.get('/session', async (req, res) => {
  try {
    // Use the session token from the request
    const session = await db.collection('sessions').doc(req.sessionToken).get();
    if (session.exists) {
      const sessionData = session.data();
      if (new Date(sessionData.expiresAt) > new Date()) {
        return res.json({ status: "valid", expiresAt: sessionData.expiresAt });
      }
      return res.json({ status: "expired" });
    }
    return res.status(404).json({ status: "not found" });
  } catch (error) {
    console.error('Error checking session status:', error);
    res.status(500).json({ error: "Failed to check session status" });
  }
});

app.get("/stripe-key", async (req, res) => {
  try {
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!stripePublishableKey) {
      throw new Error("Stripe publishable key not found");
    }
    res.status(200).json({ publishKey: stripePublishableKey });
  } catch (error) {
    console.error("Error fetching Stripe Key:", error);
    res.status(500).json({ error: "Failed to fetch Stripe key" });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

app.post("/save-address", async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentIntentId } = req.body;
    
    await db.collection('pomade-transactions').doc(paymentIntentId).set({
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Address data saved successfully" });
  } catch (error) {
    console.error("Error saving address data:", error);
    res.status(500).json({ error: "Failed to save address data" });
  }
});

exports.api = functions.https.onRequest(app);