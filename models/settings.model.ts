import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettingsDocument extends Document {
  cafeName: string;
  phone?: string;
  email?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  operatingHours: {
    open: string;
    close: string;
    days: string;
  };
  taxRate: number;
  minOrderAmount: number;
  isOpen: boolean;
  upiQrCodeImage?: string;
  upiId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDocument>({
  cafeName: { type: String, default: 'Swagatam Cafe' },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  operatingHours: {
    open: { type: String, default: '10:00' },
    close: { type: String, default: '22:00' },
    days: { type: String, default: 'Monday to Sunday' },
  },
  taxRate: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  upiQrCodeImage: { type: String },
  upiId: { type: String },
}, { timestamps: true });

const Settings: Model<ISettingsDocument> = mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);
export default Settings;
