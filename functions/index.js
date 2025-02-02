import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import stripe from 'stripe';
import * as functions from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore';

const stripeInstance = new stripe('sk_test_51QfVA1IMAr2rME9Pnoa5HD35bVGIDEtt3pCOcqyzE8ircVbe3YZHncAzp3LehCuKGLiBlaCUoVg7W3R5rGn9Apw700xGsuLiCm');
// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const db = admin.firestore();
const app = express();

// CORS Configuration to allow all origins
app.use(cors({
  origin: '*', // Allow all origins - BE CAREFUL as this opens security vulnerabilities
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
}));

// Parse JSON bodies
app.use(express.json());
// Add helmet for security headers

// Endpoint for anonymous sign-in
app.post('/anonymous-sign-in', async (req, res) => {
    try {
        const user = await admin.auth().createUser({});
        await db.collection('carts').doc(user.uid).set({
            userId: user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).json({ userId: user.uid, isAnonymous: true });
    } catch (error) {
        console.error("Error during anonymous sign-in:", error);
        res.status(500).json({ error: "Failed to sign in anonymously" });
    }
});

// Endpoint to get user data
app.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userDoc = await db.collection('carts').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

// Endpoint to get cart items
app.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartRef = db.collection('carts').doc(userId);
        const doc = await cartRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        return res.status(200).json({ cart: doc.data().items || [] });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

// Endpoint to add or update cart items
app.post('/cart-items', async (req, res) => {
    try {
        const { userId, productId, productName, price, quantity, timestamp } = req.body;
        if (!userId || !productId || !productName || !price || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const cartRef = db.collection('carts').doc(userId);
        const doc = await cartRef.get();
        let items = doc.exists ? doc.data().items || [] : [];
        
        const itemIndex = items.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            items[itemIndex] = {
                ...items[itemIndex],
                quantity: items[itemIndex].quantity + quantity,
                addedAt: timestamp || Timestamp.now().toDate().toISOString()
            };
        } else {
            items.push({
                productId: productId,
                productName: productName,
                price: price,
                quantity: quantity,
                addedAt: timestamp || Timestamp.now().toDate().toISOString(),
            });
        }

        await cartRef.set({ items }, { merge: true });
        res.status(200).json({ success: true, cart: items, cartId: userId });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Failed to update cart" });
    }
});

// Endpoint to remove item from cart
app.delete('/remove-from-cart/:userId/:productId', async (req, res) => {
    try {
      const { userId, productId } = req.params;
  
      const cartRef = db.collection('carts').doc(userId);
      const doc = await cartRef.get();
  
      let items = doc.data().items || [];
      const itemIndex = items.findIndex(item => item.productId === productId);
  
      if (itemIndex !== -1) {
        items.splice(itemIndex, 1); // Remove the item from the array
      } else {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      await cartRef.set({ items }, { merge: true });
  
      res.status(200).json({ success: true, cart: items, cartId: userId });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
});

// Endpoint to update cart item
app.put('/update-cart-item/:userId/:productId', async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const { quantity } = req.body; // Quantity to increment
  
      const cartRef = db.collection('carts').doc(userId);
      const doc = await cartRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ error: 'Cart not found for this user' });
      }
  
      let items = doc.data().items || [];
      const item = items.find(item => item.productId === productId);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      item.quantity += quantity;
  
      await cartRef.set({ items }, { merge: true });
  
      res.status(200).json({ success: true, cart: items, cartId: userId });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
});

// Endpoint to create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { cartItems } = req.body;
        
        // Log the cart items
        console.log('Received cart items:', cartItems);

        // Send back the cart items as a response for confirmation
        res.status(200).json({ cartItems: cartItems });
    } catch (error) {
        console.error("Error processing checkout request:", error);
        res.status(500).json({ error: "Failed to process checkout request" });
    }
});

export const api = functions.https.onRequest(app);