export interface IDeliveryArea {
  _id: string;
  village: string;
  pincode?: string;
  deliveryCharge: number;
  estimatedTime: number;
  isActive: boolean;
  createdAt: string;
}
