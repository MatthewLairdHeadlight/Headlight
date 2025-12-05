import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe client-side integration
// Credit card data is sent directly to Stripe - never touches our servers
// This ensures PCI compliance and secure handling of payment information

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Payment intent creation would happen server-side
// This interface defines what we expect from the server
export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  description: string;
  patientId: string;
  providerId: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * DEPRECATED - DO NOT USE IN PRODUCTION
 * 
 * This interface is provided for type reference only.
 * In production, card data should NEVER be handled by your application.
 * 
 * Instead, use Stripe Elements which:
 * - Securely collects card data in an iframe
 * - Tokenizes card information directly with Stripe
 * - Never exposes raw card data to your JavaScript
 * 
 * @deprecated Use Stripe Elements for card collection
 */
export interface PaymentMethodData {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  billingDetails: {
    name: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

// Stripe Elements configuration
export const getStripeElementsOptions = (clientSecret: string) => ({
  clientSecret,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0066cc',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e6e6e6',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      '.Input:focus': {
        border: '1px solid #0066cc',
        boxShadow: '0 0 0 2px rgba(0, 102, 204, 0.1)',
      },
    },
  },
});
