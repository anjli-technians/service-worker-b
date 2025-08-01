// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webPush from 'web-push';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// VAPID keys
const publicKey = process.env.PUBLICKEY;
const privateKey = process.env.PRIVATEKEY;

webPush.setVapidDetails(
  'mailto:bharatlal.kumar@technians.com',
  publicKey,
  privateKey
);

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(bodyParser.json());

// Routes
import subscribeRoute from './routes/subscribe.js';
import notifyRoute from './routes/notify.js';

app.use('/subscribe', subscribeRoute);
app.use('/sendNotification', notifyRoute);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ DB connection error:', err));
