import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOfferDocument extends Document {
  title: string;
  description?: string;
  image?: string;
  type: 'percentage' | 'flat' | 'bogo' | 'freeDelivery';
  value?: number;
  product?: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOfferDocument>({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  type: { type: String, enum: ['percentage', 'flat', 'bogo', 'freeDelivery'], required: true },
  value: { type: Number },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

OfferSchema.index({ isActive: 1, validUntil: 1 });

const Offer: Model<IOfferDocument> = mongoose.models.Offer || mongoose.model<IOfferDocument>('Offer', OfferSchema);
export default Offer;
