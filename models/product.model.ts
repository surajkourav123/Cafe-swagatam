import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  prepTime: number;
  sortOrder: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: 500 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String, required: true },
  isVeg: { type: Boolean, required: true, default: true },
  isBestSeller: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  prepTime: { type: Number, default: 15, min: 1 },
  sortOrder: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, isAvailable: 1, sortOrder: 1 });
ProductSchema.index({ isBestSeller: 1, isAvailable: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

const Product: Model<IProductDocument> = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
export default Product;
