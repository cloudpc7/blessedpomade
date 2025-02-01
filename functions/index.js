const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const helmet = require('helmet');
const serviceAccount = require('./blessedpomadeAdmin.json');
const functions = require('firebase-functions');
const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const db = admin.firestore();
const app = express();
app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus:200
 }));
app.use(express.json());
app.use(helmet());
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
        // If item not found, return an error since this operation should be for removing an existing item
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
        // This should not happen since it's a PUT, but for completeness:
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      // Increment the quantity
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
        const cart = cartItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity
        }));

        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productName,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            automatic_tax: {
                enabled: true,
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: process.env.CANCEL_URL,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

module.exports.api = functions.https.onRequest(app);