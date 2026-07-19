export interface IReview {
  _id: string;
  user: { _id: string; name: string } | string;
  product: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}
