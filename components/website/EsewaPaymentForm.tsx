"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { PaymentParams } from "@/lib/api/enrollments";

interface EsewaPaymentFormProps {
  paymentParams: PaymentParams;
  paymentUrl: string;
  onCancel?: () => void;
}

export function EsewaPaymentForm({ paymentParams, paymentUrl, onCancel }: EsewaPaymentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Auto-submit the form when component mounts
    // Small delay to ensure form is fully rendered
    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.submit();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-4 max-w-md">
        <Loader2 className="w-12 h-12 animate-spin text-[color:var(--brand-blue)] mx-auto" />
        <h3 className="text-xl font-semibold text-slate-900">Redirecting to eSewa Payment</h3>
        <p className="text-sm text-slate-600">
          Please wait while we redirect you to complete your payment. Do not close this window.
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Cancel Payment
          </button>
        )}
      </div>

      {/* Hidden form that auto-submits to eSewa */}
      <form
        ref={formRef}
        method="POST"
        action={paymentUrl}
        className="hidden"
      >
        <input type="hidden" name="signature" value={paymentParams.signature} />
        <input type="hidden" name="signed_field_names" value={paymentParams.signed_field_names} />
        <input type="hidden" name="amount" value={paymentParams.amount} />
        <input type="hidden" name="total_amount" value={paymentParams.total_amount} />
        <input type="hidden" name="transaction_uuid" value={paymentParams.transaction_uuid} />
        <input type="hidden" name="product_code" value={paymentParams.product_code} />
        <input type="hidden" name="success_url" value={paymentParams.success_url} />
        <input type="hidden" name="failure_url" value={paymentParams.failure_url} />
        <input type="hidden" name="tax_amount" value={paymentParams.tax_amount} />
        <input type="hidden" name="product_service_charge" value={paymentParams.product_service_charge} />
        <input type="hidden" name="product_delivery_charge" value={paymentParams.product_delivery_charge} />
      </form>
    </div>
  );
}

