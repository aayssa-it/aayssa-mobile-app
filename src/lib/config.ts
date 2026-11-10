/**
 * Base URL of the AAYSSA membership API.
 * Override with EXPO_PUBLIC_API_URL in a local `.env` (for example a Vercel preview URL).
 */
 export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://portal.atlantaayyappasevasangam.org/api')
 .replace(/\/+$/, '');

/** Where Board members create new campaigns (Zeffy's own website). */
export const ZEFFY_DASHBOARD_URL = 'https://www.zeffy.com/login';


/** Sample-data mode (no API calls). Set EXPO_PUBLIC_DEMO_MODE=1 in .env.local to turn it on. */
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === '1';