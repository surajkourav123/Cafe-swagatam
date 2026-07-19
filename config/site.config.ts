export const siteConfig = {
  name: 'Swagatam Cafe',
  description:
    'Premium food ordering platform — Cafe, Fast Food & Restaurant in Gadarwara, Madhya Pradesh. Order online for home delivery.',
  tagline: 'Where Every Bite Tells a Story',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  phone: '+91 XXXXX XXXXX',
  email: 'hello@swagatamcafe.com',
  address: 'Station Road, In Front of Comfort Hotel, Gadarwara, Madhya Pradesh, India',
  location: {
    lat: 22.9247,
    lng: 78.7844,
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
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d78.7844!3d22.9247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU1JzI5LjAiTiA3OMKwNDcnMDMuOCJF!5e0!3m2!1sen!2sin!4v1',
  keywords: [
    'Swagatam Cafe',
    'Gadarwara restaurant',
    'food delivery Gadarwara',
    'cafe Madhya Pradesh',
    'online food order',
    'pizza delivery',
    'burger',
    'coffee shop',
    'Station Road Gadarwara',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
