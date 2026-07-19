import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationDocument extends Document {
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  user?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'promo', 'system'], default: 'system' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotificationDocument> = mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', NotificationSchema);
export default Notification;
