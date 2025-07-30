// routes/subscribe.js
import express from 'express';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const subscription = req.body;

  try {
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      await Subscription.create(subscription);
      res.status(201).json({ message: 'Subscription saved successfully' });
    } else {
      res.status(200).json({ message: 'Already subscribed' });
    }
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Subscription save failed' });
  }
});

export default router;
