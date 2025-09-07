"use client";

import { useState } from 'react';
import { CreditCard, Wallet, Banknote, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOrderStore } from '@/lib/stores/order-store';
import { PAYMENT_METHODS } from '@/lib/types/order';
import { cn } from '@/lib/utils';

export function PaymentForm() {
  const { currentOrder, setPaymentMethod, setPaymentInfo } = useOrderStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentInfo({}); // Clear payment info when method changes
    setErrors({}); // Clear errors
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    const newInfo = { ...currentOrder.paymentInfo, [field]: value };
    setPaymentInfo(newInfo);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePaymentInfo = () => {
    const newErrors: Record<string, string> = {};
    const method = currentOrder.paymentMethod;
    const info = currentOrder.paymentInfo;

    if (method === 'BKASH') {
      if (!info.bkashNumber?.trim()) {
        newErrors.bkashNumber = 'bKash number is required';
      }
      if (!info.bkashTransactionId?.trim()) {
        newErrors.bkashTransactionId = 'Transaction ID is required';
      }
    }

    if (method === 'NAGAD') {
      if (!info.bkashNumber?.trim()) { // Using same field for Nagad
        newErrors.bkashNumber = 'Nagad number is required';
      }
      if (!info.bkashTransactionId?.trim()) { // Using same field for transaction ID
        newErrors.bkashTransactionId = 'Transaction ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Banknote className="h-5 w-5" />;
      case 'POS_CARD':
        return <CreditCard className="h-5 w-5" />;
      case 'BKASH':
        return <Smartphone className="h-5 w-5" />;
      case 'NAGAD':
        return <Wallet className="h-5 w-5" />;
      default:
        return <Banknote className="h-5 w-5" />;
    }
  };

  const selectedMethod = PAYMENT_METHODS.find(
    method => method.value === currentOrder.paymentMethod
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={currentOrder.paymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {PAYMENT_METHODS.map((method) => (
            <div key={method.value}>
              <RadioGroupItem
                value={method.value}
                id={method.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.value}
                className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                  "peer-checked:border-primary peer-checked:bg-primary/5",
                  "hover:border-primary/50"
                )}
              >
                {getPaymentMethodIcon(method.value)}
                <div>
                  <div className="font-medium">{method.label}</div>
                  {method.requiresDetails && (
                    <div className="text-sm text-muted-foreground">
                      Additional details required
                    </div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Payment Details */}
        {selectedMethod?.requiresDetails && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Payment Details</h4>
            
            {currentOrder.paymentMethod === 'CASH' && (
              <div className="text-sm text-muted-foreground">
                No additional details required for cash payment
              </div>
            )}

            {currentOrder.paymentMethod === 'POS_CARD' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardLastFourDigits">Last 4 digits of card</Label>
                  <Input
                    id="cardLastFourDigits"
                    placeholder="1234"
                    maxLength={4}
                    value={currentOrder.paymentInfo.cardLastFourDigits || ''}
                    onChange={(e) => handlePaymentInfoChange('cardLastFourDigits', e.target.value)}
                    className={errors.cardLastFourDigits ? 'border-red-500' : ''}
                  />
                  {errors.cardLastFourDigits && (
                    <p className="text-sm text-red-600">{errors.cardLastFourDigits}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentNote">Payment notes (optional)</Label>
                  <Textarea
                    id="paymentNote"
                    placeholder="Any additional notes about the payment..."
                    rows={3}
                    value={currentOrder.paymentInfo.paymentNote || ''}
                    onChange={(e) => handlePaymentInfoChange('paymentNote', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentOrder.paymentMethod === 'BKASH' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bkashNumber">bKash Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="bkashNumber"
                    placeholder="01XXXXXXXXX"
                    value={currentOrder.paymentInfo.bkashNumber || ''}
                    onChange={(e) => handlePaymentInfoChange('bkashNumber', e.target.value)}
                    className={errors.bkashNumber ? 'border-red-500' : ''}
                  />
                  {errors.bkashNumber && (
                    <p className="text-sm text-red-600">{errors.bkashNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bkashTransactionId">Transaction ID <span className="text-red-500">*</span></Label>
                  <Input
                    id="bkashTransactionId"
                    placeholder="BKS123456789"
                    value={currentOrder.paymentInfo.bkashTransactionId || ''}
                    onChange={(e) => handlePaymentInfoChange('bkashTransactionId', e.target.value)}
                    className={errors.bkashTransactionId ? 'border-red-500' : ''}
                  />
                  {errors.bkashTransactionId && (
                    <p className="text-sm text-red-600">{errors.bkashTransactionId}</p>
                  )}
                </div>
              </div>
            )}

            {currentOrder.paymentMethod === 'NAGAD' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nagadNumber">Nagad Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="nagadNumber"
                    placeholder="01XXXXXXXXX"
                    value={currentOrder.paymentInfo.bkashNumber || ''} // Using same field
                    onChange={(e) => handlePaymentInfoChange('bkashNumber', e.target.value)}
                    className={errors.bkashNumber ? 'border-red-500' : ''}
                  />
                  {errors.bkashNumber && (
                    <p className="text-sm text-red-600">{errors.bkashNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nagadTransactionId">Transaction ID <span className="text-red-500">*</span></Label>
                  <Input
                    id="nagadTransactionId"
                    placeholder="NGD123456789"
                    value={currentOrder.paymentInfo.bkashTransactionId || ''} // Using same field
                    onChange={(e) => handlePaymentInfoChange('bkashTransactionId', e.target.value)}
                    className={errors.bkashTransactionId ? 'border-red-500' : ''}
                  />
                  {errors.bkashTransactionId && (
                    <p className="text-sm text-red-600">{errors.bkashTransactionId}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}