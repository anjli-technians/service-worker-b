// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, unique: true },
  expirationTime: Date,
  keys: {
    p256dh: String,
    auth: String
  }
});

export default mongoose.model('Subscription', subscriptionSchema);
