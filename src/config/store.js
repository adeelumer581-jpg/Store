/**
 * Central storefront configuration for Bare & Bloom by Robaha.
 * Update placeholder values (WhatsApp number, bank details, webhook URL, Meta Pixel ID)
 * before going live.
 */

export const STORE_CONFIG = {
  storeName: 'Bare & Bloom',
  storeSubtitle: 'By Robaha',
  fullStoreName: 'Bare & Bloom by Robaha | Skincare',
  tagline: 'Botanical, dermatologist-tested skincare crafted for Pakistani skin & climate.',

  // Replace with the owner's active WhatsApp Business number in 923XXXXXXXXX format (no + or spaces)
  WHATSAPP_NUMBER: '923000000000',

  // Confirm official Instagram profile handle before launch
  INSTAGRAM_URL: 'https://instagram.com/bareandbloom.pk',
  INSTAGRAM_HANDLE: '@bareandbloom.pk',

  // Nationwide shipping rules (PKR)
  FREE_SHIPPING_THRESHOLD: 3000,
  FLAT_SHIPPING_RATE: 200,
  DELIVERY_DAYS: '2-4',

  // Active promo codes (case-insensitive matching handled in pricing.js)
  PROMO_CODES: {
    GLOW10: {
      code: 'GLOW10',
      type: 'percent',
      value: 10,
      label: '10% off merchandise subtotal',
    },
  },

  // Supported delivery cities in Pakistan
  CITIES: [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
  ],

  // Owner must replace these placeholder accounts before enabling prepaid orders
  PAYMENT_ACCOUNTS: {
    accountTitle: 'Bare & Bloom by Robaha (Placeholder Title)',
    bankName: 'Meezan Bank / Raast (Placeholder)',
    ibanOrAccount: 'PK00 XXXX 0000 0000 0000 0000 (Placeholder)',
    jazzCash: '03XX-XXXXXXX (Placeholder)',
    easyPaisa: '03XX-XXXXXXX (Placeholder)',
    screenshotNote: 'Share your payment screenshot on WhatsApp/Instagram with your Order ID.',
  },

  // Trust badges displayed on Home; owner must confirm certifications before launch
  TRUST_BADGES: [
    '100% Halal',
    'Dermatologist Tested',
    'Cruelty-Free',
    'Made for Pakistani Climate',
  ],

  // Google Apps Script Web App URL for receiving orders (see docs/order-webhook-setup.md)
  // Leave empty to operate purely with local storage + WhatsApp order confirmation.
  ORDER_WEBHOOK_URL: '',

  // Optional Meta Pixel ID (leave empty to load nothing and keep all tracking no-op)
  META_PIXEL_ID: '',

  // Canonical site URL used for sharing links
  SITE_URL: 'https://bareandbloom.pk',
};
