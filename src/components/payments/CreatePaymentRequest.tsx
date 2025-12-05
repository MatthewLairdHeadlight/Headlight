'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface CreatePaymentRequestProps {
  patientId: string;
  patientName: string;
  onSubmit: (amount: number, description: string) => void;
  onCancel?: () => void;
}

export function CreatePaymentRequest({
  patientName,
  onSubmit,
  onCancel,
}: CreatePaymentRequestProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description for the payment');
      return;
    }

    setSubmitting(true);
    try {
      // Convert dollars to cents for Stripe
      const amountInCents = Math.round(amountValue * 100);
      onSubmit(amountInCents, description.trim());
    } catch {
      setError('Failed to create payment request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Request Payment</CardTitle>
        <CardDescription>
          Send a secure payment request to {patientName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Office visit co-pay, Lab work, Consultation fee..."
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" loading={submitting} className="flex-1">
              Send Request
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            The patient will receive a secure payment link to complete this transaction via Stripe.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
