const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');
const serviceAccount = require('./blessedpomadeAdmin.json');
const stripe = require('stripe');
const functions = require('firebase-functions');
const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { RESET_VALUE } = require('firebase-functions/options');
const { useSpringRef } = require('react-spring');
const { faCropSimple } = require('@fortawesome/free-solid-svg-icons');

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} catch (error) {
    console.error(error);
}

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

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

app.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Fetching cart for userId:", userId);
        const cartRef = db.collection('carts').doc(userId);
        const doc = await cartRef.get();
        console.log("Fetched document:", doc.exists ? doc.data() : 'Document does not exist');

        if (!doc.exists) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        return res.status(200).json({ cart: doc.data().items || [] });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

app.post('/cart-items', async (req, res) => {
    try {
        const { userId, productId, productName, price, quantity, timestamp } = req.body;
        console.log("Updating cart for userId:", userId);
        const cartRef = db.collection('carts').doc(userId);
        const doc = await cartRef.get();
        let items = doc.exists ? doc.data().items || [] : [];

        items.push({
            productId: productId,
            productName: productName,
            price: price,
            quantity: quantity,
            addedAt: timestamp || Timestamp.now().toDate().toISOString(),
        });

        await cartRef.set({ items }, { merge: true });

        // Log the updated state for debugging
        const updatedDoc = await cartRef.get();
        console.log("Updated cart document:", updatedDoc.data());

        res.status(200).json({ success: true, cart: items, cartId: userId });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Failed to update cart" });
    }
});


  
module.exports.api = functions.https.onRequest(app);