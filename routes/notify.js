// routes/notify.js
import express from 'express';
import webPush from 'web-push';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const notificationPayload = JSON.stringify({
    title: 'Push Notification',
    body: 'This is from your backend!',
    url: '/'
  });

  try {
    const subscriptions = await Subscription.find();
    console.log( Found ${subscriptions.length} subscriptions to notify);

    if (subscriptions.length === 0) {
      return res.status(200).json({ message: 'No subscriptions found to notify' });
    }

    const results = [];
    const sendPromises = subscriptions.map(async (sub, index) => {
      try {
        console.log( Sending notification ${index + 1}/${subscriptions.length} to: ${sub.endpoint.substring(0, 50)}...);
        
        const result = await webPush.sendNotification(sub, notificationPayload);
        console.log( Notification ${index + 1} sent successfully);
        results.push({ success: true, endpoint: sub.endpoint });
        return result;
      } catch (err) {
        console.error( Failed to send notification ${index + 1}:, err.message);
        
        // Clean up expired subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log( Removing expired subscription: ${sub.endpoint.substring(0, 50)}...);
          await Subscription.deleteOne({ _id: sub._id });
        }
        
        results.push({ 
          success: false, 
          endpoint: sub.endpoint, 
          error: err.message 
        });
        return null;
      }
    });

    await Promise.all(sendPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log( Notification Summary: ${successful} successful, ${failed} failed);
    
    res.status(200).json({ 
      message: Push notifications sent! ${successful} successful, ${failed} failed,
      results: results
    });
  } catch (err) {
    console.error(' Error in notification route:', err);
    res.status(500).json({ error: 'Notification send failed', details: err.message });
  }
});

export default router;
