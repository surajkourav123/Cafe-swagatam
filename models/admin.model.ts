import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'superadmin' },
}, { timestamps: true });

AdminSchema.index({ email: 1 }, { unique: true });

const Admin: Model<IAdminDocument> = mongoose.models.Admin || mongoose.model<IAdminDocument>('Admin', AdminSchema);
export default Admin;
