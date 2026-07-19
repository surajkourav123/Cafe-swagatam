import { OrdersClient } from './orders-client';

export const metadata = {
  title: 'Order Manager — Swagatam Cafe Admin',
  description: 'Track and update statuses of current orders in Gadarwara.',
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
