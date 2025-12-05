'use client';

import React from 'react';
import { PaymentRequest, User } from '@/types';
import { Button } from '@/components/ui/Button';

interface PaymentListProps {
  payments: PaymentRequest[];
  currentUser: User;
  users: Map<string, User>;
  onPayNow?: (paymentId: string) => void;
}

export function PaymentList({ payments, currentUser, users, onPayNow }: PaymentListProps) {
  const formatAmount = (amountInCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInCents / 100);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: PaymentRequest['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No payment requests found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {payments.map((payment) => {
        const otherUserId = currentUser.role === 'provider' ? payment.patientId : payment.providerId;
        const otherUser = users.get(otherUserId);
        const isPatient = currentUser.role === 'patient';

        return (
          <div key={payment.id} className="py-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {payment.description}
                </h4>
                {getStatusBadge(payment.status)}
              </div>
              <p className="text-sm text-gray-500">
                {currentUser.role === 'provider' ? 'Requested from' : 'Requested by'}{' '}
                <span className="font-medium">{otherUser?.name || 'Unknown'}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {formatDate(payment.createdAt)}
                {payment.paidAt && (
                  <span className="ml-2">• Paid: {formatDate(payment.paidAt)}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <span className="text-lg font-semibold text-gray-900">
                {formatAmount(payment.amount, payment.currency)}
              </span>
              {isPatient && payment.status === 'pending' && onPayNow && (
                <Button size="sm" onClick={() => onPayNow(payment.id)}>
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
