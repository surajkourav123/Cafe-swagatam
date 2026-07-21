export const siteConfig = {
  name: 'Swagatam Cafe',
  description:
    'Premium food ordering platform — Cafe, Fast Food & Restaurant in Chichli, Madhya Pradesh. Order online for home delivery.',
  tagline: 'Where Every Bite Tells a Story',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  phone: '+91 91746 50575',
  email: 'swagatamcafeofficial@gmail.com',
  address: 'Station Road, In Front of Comfort Hotel, Chichli, Madhya Pradesh, India',
  location: {
    lat: 22.8398,
    lng: 78.8200,
  },
  operatingHours: {
    open: '10:00',
    close: '22:00',
    days: 'Monday to Sunday',
  },
  taxRate: 0, // No GST initially — configurable via Admin Panel
  currency: '₹',
  minOrderAmount: 0,
  social: {
    instagram: '#',
    facebook: '#',
    twitter: '#',
  },
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14691.564757342605!2d78.81050212724495!3d22.834241639144433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397e59f8c6e2b9c7%3A0x8d5c5f4b4a3a3a3!2sChichli%2C%20Madhya%20Pradesh%20487551!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  keywords: [
    'Swagatam Cafe',
    'Chichli restaurant',
    'food delivery Chichli',
    'cafe Madhya Pradesh',
    'online food order',
    'pizza delivery',
    'burger',
    'coffee shop',
    'Station Road Chichli',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
