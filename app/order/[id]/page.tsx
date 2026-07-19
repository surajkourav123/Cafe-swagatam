import { OrderClient } from './order-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Order #${id.slice(-6).toUpperCase()} — Swagatam Cafe`,
    description: 'Track your food order status live.',
  };
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderClient orderId={id} />;
}
