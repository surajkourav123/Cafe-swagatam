import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryDocument extends Document {
  title: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGalleryDocument>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Gallery: Model<IGalleryDocument> = mongoose.models.Gallery || mongoose.model<IGalleryDocument>('Gallery', GallerySchema);
export default Gallery;
