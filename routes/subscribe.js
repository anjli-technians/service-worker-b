// routes/subscribe.js
import express from 'express';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const subscription = req.body;

  try {
    // console.log('📝 New subscription request received');
    // console.log('🔗 Endpoint:', subscription.endpoint.substring(0, 50) + '...');
    
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      await Subscription.create(subscription);
      // console.log('✅ New subscription saved successfully');
      res.status(201).json({ message: 'Subscription saved successfully' });
    } else {
      // console.log('ℹ️ Subscription already exists');
      res.status(200).json({ message: 'Already subscribed' });
    }
  } catch (error) {
    // console.error('❌ Error saving subscription:', error);
    res.status(500).json({ error: 'Subscription save failed' });
  }
});

router.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  try {
    // console.log('📝 Subscribe request received');
    // console.log('🔗 Endpoint:', subscription.endpoint.substring(0, 50) + '...');
    
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      await Subscription.create(subscription);
      // console.log("✅ New subscription stored.");
    } else {
      // console.log("ℹ️ Subscription already exists.");
    }

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    // console.error("❌ Error storing subscription:", err);
    res.status(500).json({ error: "Subscription failed" });
  }
});

// Add a route to get all subscriptions (for debugging)
router.get('/list', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    // console.log( Found ${subscriptions.length} total subscriptions);
    res.status(200).json({ 
      count: subscriptions.length,
      subscriptions: subscriptions.map(sub => ({
        id: sub._id,
        endpoint: sub.endpoint.substring(0, 50) + '...',
        createdAt: sub.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

export default router;
