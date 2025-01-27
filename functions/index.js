const dotenv = require("dotenv");
dotenv.config();
const functions = require("firebase-functions");
const {admin, db} = require("./firebase-config");
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(cors({origin: true}));
app.use(express.json());

app.get("/stripe-key", async (req,res) => {
  try {
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!stripePublishableKey) {
      throw new Error("Stripe publishable key not found");
    }
    res.status(200).json({ publishKey: stripePublishableKey});
  } catch (error) {
    console.error("Error fetching Stripe Key:", error);
    res.status(500).json({ error: "Failed to fetch Stripe key"});
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
    
    // Save to Firestore
    await db.collection('orders').doc(paymentIntentId).set({
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Address data saved successfully" });
  } catch (error) {
    console.error("Error saving address data:", error);
    res.status(500).json({ error: "Failed to save address data" });
  }
});

exports.api = functions.https.onRequest(app);

