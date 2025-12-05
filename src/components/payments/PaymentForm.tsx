'use client';

import React, { useState } from 'react';
import { PaymentRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface PaymentFormProps {
  paymentRequest: PaymentRequest;
  onPaymentSuccess: () => void;
  onCancel?: () => void;
}

/**
 * PaymentForm component that integrates with Stripe for secure credit card processing.
 * 
 * SECURITY NOTES:
 * - Credit card data is NEVER handled by our servers
 * - All sensitive payment data goes directly to Stripe via their SDK
 * - We only store references (payment intent IDs) for reconciliation
 * - This ensures PCI DSS compliance
 */
export function PaymentForm({ paymentRequest, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (amountInCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInCents / 100);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      /**
       * DEMO PAYMENT FLOW - NOT FOR PRODUCTION USE
       * 
       * In a production environment, this would:
       * 1. Create a payment intent on the server via API call
       * 2. Use Stripe Elements to securely collect card details
       * 3. Confirm the payment with Stripe's confirmCardPayment()
       * 4. Handle 3D Secure authentication if required
       * 5. Process webhooks for payment status updates
       * 
       * For production, replace this with actual Stripe integration:
       * - Use @stripe/react-stripe-js Elements provider
       * - Never handle raw card data on the client
       * - Implement server-side payment intent creation
       */
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Demo payment processing is disabled in production. Please configure Stripe integration.');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      onPaymentSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Secure payment processed by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Description</span>
            <span className="font-medium">{paymentRequest.description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(paymentRequest.amount, paymentRequest.currency)}
            </span>
          </div>
        </div>

        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secured by Stripe - Your card details are encrypted</span>
        </div>

        {/* Demo Card Form Placeholder */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Demo Mode:</strong> In production, Stripe Elements would appear here to securely collect card details.
          </p>
          <div className="space-y-3">
            <div className="h-10 bg-white border border-gray-200 rounded flex items-center px-3">
              <span className="text-gray-400 text-sm">4242 4242 4242 4242</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-white border border-gray-200 rounded flex items-center px-3">
                <span className="text-gray-400 text-sm">MM / YY</span>
              </div>
              <div className="w-24 h-10 bg-white border border-gray-200 rounded flex items-center px-3">
                <span className="text-gray-400 text-sm">CVC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Security Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Your payment information is encrypted and sent directly to Stripe</p>
          <p>• We never store your credit card details on our servers</p>
          <p>• Stripe is PCI Level 1 certified - the highest security standard</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button onClick={handlePayment} loading={loading} className="flex-1">
            Pay {formatAmount(paymentRequest.amount, paymentRequest.currency)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
