export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
}

export interface CartState {
  items: CartItem[];
  deliveryArea: string | null;
  couponCode: string | null;
  couponDiscount: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}
