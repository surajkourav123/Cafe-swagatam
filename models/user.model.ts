import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'customer';
  favorites: mongoose.Types.ObjectId[];
  addresses: {
    _id?: mongoose.Types.ObjectId;
    label: 'Home' | 'Work' | 'Other';
    name: string;
    phone: string;
    village: string;
    address: string;
    landmark?: string;
    isDefault: boolean;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSubSchema = new Schema({
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  village: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, unique: true, match: /^[6-9]\d{9}$/ },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['customer'], default: 'customer' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [addressSubSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ createdAt: -1 });

const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default User;
