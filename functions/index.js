import admin from 'firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import serviceAccount from './blessedpomadeAdmin.json' with { type: "json" };
import stripe from 'stripe';
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore({ databaseId: 'product-pomade' });
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Function to generate a session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Middleware to initialize session or provide a new session token
app.use(async (req, res, next) => {
  let sessionToken = req.headers['session-token'];

  if (!sessionToken) {
    sessionToken = generateSessionToken();
    try {
      await db.collection('sessions').doc(sessionToken).set({
        createdAt: Timestamp.fromDate(new Date()),
        expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000), // 1 hour expiration, adjust as needed
        cart: [] // Start with an empty cart
      });
      res.header('Session-Token', sessionToken);
      req.sessionToken = sessionToken;
    } catch (error) {
      console.error('Failed to create session:', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }
  } else {
    try {
      const session = await db.collection('sessions').doc(sessionToken).get();
      if (session.exists && session.data().expiresAt.toDate() > new Date()) {
        // Session is valid, update expiry time
        await session.ref.update({
          expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000)
        });
        req.sessionToken = sessionToken;
      } else {
        // If session expired or not found, do not create a new one, inform client
        return res.status(401).json({ error: 'Session expired or not found' });
      }
    } catch (error) {
      console.error('Error validating session:', error);
      return res.status(500).json({ error: 'Failed to validate session' });
    }
  }
  
  next();
});

// Check session status
app.get('/sessions', async (req, res) => {
  try {
    const session = await db.collection('sessions').doc(req.sessionToken).get();
    if (session.exists) {
      const sessionData = session.data();
      if (sessionData.expiresAt.toDate() > new Date()) {
        return res.json({ status: "valid", expiresAt: sessionData.expiresAt.toDate().toISOString() });
      }
      return res.json({ status: "expired" });
    }
    return res.status(404).json({ status: "not found" });
  } catch (error) {
    console.error('Error checking session status:', error);
    res.status(500).json({ error: "Failed to check session status" });
  }
});

// Add to cart
app.post('/cart', async (req, res) => {
  try {
    const { item } = req.body;
    if (!item.id || !item.price) {
      return res.status(400).json({ error: 'Item must have id and price' });
    }
    const sessionRef = db.collection('sessions').doc(req.sessionToken);
    const sessionDoc = await sessionRef.get();
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    const sessionData = sessionDoc.data();
    if (new Date(sessionData.expiresAt.toDate()) < new Date()) {
      return res.status(403).json({ error: 'Session expired' });
    }

    let cart = sessionData.cart || [];
    const itemInCart = cart.find(cartItem => cartItem.id === item.id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    await sessionRef.update({
      cart: cart,
      expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000) // Reset session expiry
    });

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Get cart
app.get('/cart', async (req, res) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.sessionToken);
    const sessionDoc = await sessionRef.get();
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (new Date(sessionData.expiresAt.toDate()) < new Date()) {
      return res.status(403).json({ error: 'Session expired' });
    }
    const cart = sessionData.cart || [];
    res.status(200).json({ cart: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.delete('/cart/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const sessionRef = db.collection('sessions').doc(req.sessionToken);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (new Date(sessionData.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Session expired' });
    }

    let cart = sessionData.cart || [];
    // Find the index of the item to remove
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      cart.splice(itemIndex, 1); // Remove the item
    } else {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Update session with the new cart data
    await sessionRef.update({
      cart: cart,
      expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000) // Use Timestamp for consistency
    });

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ error: "Failed to delete item from cart" });
  }
});

app.put('/cart/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    const sessionRef = db.collection('sessions').doc(req.sessionToken);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (new Date(sessionData.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Session expired' });
    }

    let cart = sessionData.cart || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await sessionRef.update({
      cart: cart,
      expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000)
    });

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});

app.get("/stripe-key", async (req, res) => {
  try {
    // Retrieve the session token from the request headers
    const sessionToken = req.headers['session-token'];
    if (!sessionToken) {
      return res.status(401).json({ error: "Session token is required" });
    }

    // Validate the session token including cart check
    const session = await validateSessionAndCart(sessionToken);

    if (!session || session.expiresAt > new Date()) {
      return res.status(403).json({ error: "Invalid or expired session" });
    }

    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!stripePublishableKey) {
      throw new Error("Stripe publishable key not found");
    }

    res.status(200).json({ publishKey: stripePublishableKey });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Stripe key" });
  }
});

// Enhanced session validation function that checks for an active cart
async function validateSessionAndCart(sessionToken) {
  try {
    // Fetch session from your session store (e.g., database)
    const session = await db.collection('sessions').doc(sessionToken).get();
    if (!session.exists) {
      return null;
    }
    
    const sessionData = session.data();
    const currentTime = new Date();
    
    // Check if session has not expired
    if (sessionData.expiresAt.toDate() < currentTime) {
      await session.ref.delete(); // Delete expired session
      return null;
    }
    
    // Check for an active, non-empty cart 
    if (!sessionData.cart || sessionData.cart.length === 0) {
      // Comment this return if you want to allow access even with an empty cart
      // return null;
    }
    return sessionData;
  } catch (error) {
    console.error('Session and cart validation error:', error);
    return null;
  }
};

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripeInstance.paymentIntents.create({
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

export const api = functions.https.onRequest(app);