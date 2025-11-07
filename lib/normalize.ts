//TODO: Add more features to the canonical list use AI to generate more features.
const FEATURE_CANON: Record<string, string> = {
    '1-tap checkout': 'Fast checkout',
    '1-click checkout': 'Fast checkout',
    'bookings': '1:1 bookings',
    'appointments': '1:1 bookings',
    'courses': 'Course builder',
    'online courses': 'Course builder',
    'email marketing': 'Email automation',
    'email automations': 'Email automation',
    'tips': 'Tips/Donations',
    'donations': 'Tips/Donations',
  };
  
  export function normalizeFeature(raw: string) {
    const key = raw.toLowerCase().trim();
    return FEATURE_CANON[key] ?? raw;
  }
  
  export function normalizePriceToMonthly(price: number, cadence: 'monthly'|'annual') {
    return cadence === 'annual' ? price / 12 : price;
  }