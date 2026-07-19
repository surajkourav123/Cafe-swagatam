import { CouponsClient } from './coupons-client';

export const metadata = {
  title: 'Discount Coupons — Swagatam Cafe Admin',
  description: 'Manage active promo codes and customer discounts.',
};

export default function CouponsPage() {
  return <CouponsClient />;
}
