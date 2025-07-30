// routes/notify.js
import express from 'express';
import webPush from 'web-push';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const notificationPayload = JSON.stringify({
    title: 'Push Notification',
    body: 'This is from your backend!',
    url: '/sendNotification'
  });

  try {
    const subscriptions = await Subscription.find();

    const sendPromises = subscriptions.map(sub =>
      webPush.sendNotification(sub, notificationPayload).catch(async err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.deleteOne({ _id: sub._id }); // Clean up expired
        }
      })
    );

    await Promise.all(sendPromises);
    res.status(200).json({ message: 'Push notifications sent!' });
  } catch (err) {
    console.error('Error sending push:', err);
    res.status(500).json({ error: 'Notification send failed' });
  }
});

export default router;
