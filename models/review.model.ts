import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewDocument extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500, trim: true },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

ReviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review: Model<IReviewDocument> = mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
export default Review;
