const express = require('express');
const bodyParser = require('body-parser');
const { db, FieldValue } = require('./firebase-config'); // Import Firebase Firestore
const nodemailer = require('nodemailer'); // For sending email confirmations
const stripe = require('stripe')('your-stripe-secret-key');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes
app.post('/purchase', async (req, res) => {
  const { shippingInfo, productId, totalPrice } = req.body;

  try {
    // 1. Store the transaction in Firestore
    const transactionRef = db.collection('transactions').doc();
    await transactionRef.set({
      shippingInfo,
      productId,
      totalPrice,
      timestamp: FieldValue.serverTimestamp(),
    });

    // 2. Send confirmation email with receipt
    const receiptData = `Product: ${productId}\nTotal: $${totalPrice}\nShipping Address: ${JSON.stringify(shippingInfo)}`;
    await sendConfirmationEmail(shippingInfo.email, receiptData);

    // 3. Send a success response
    res.status(200).send({ message: 'Purchase successful. Confirmation email sent.' });

  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).send({ error: 'An error occurred while processing the purchase.' });
  }
});

app.post('/create-payment-intent', async (req,res) => {
    const { amount } = req.body;
    try {

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        })

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: 'Error creating payment intent.'});
    }
});

// Helper function to send email confirmations using Nodemailer
const sendConfirmationEmail = (recipientEmail, receiptData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password', // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: 'Your Order Confirmation',
    text: `Thank you for your purchase! Here is your receipt:\n\n${receiptData}`,
  };

  return transporter.sendMail(mailOptions);
};

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
