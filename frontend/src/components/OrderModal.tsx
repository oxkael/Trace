import React, { useState, useEffect } from 'react';
import type { OrderPreview, OrderResult } from '../types/contract';
import { X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface OrderModalProps {
  preview: OrderPreview;
  onClose: () => void;
  onConfirm: (token: string) => Promise<OrderResult>;
}

export const OrderModal: React.FC<OrderModalProps> = ({ preview, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await onConfirm(preview.confirmation_token);
      setResult(res);
    } catch (e: any) {
      setResult({
        type: 'order_result',
        status: 'failed',
        mode: preview.mode,
        message: e?.message || 'Failed to submit order',
        retryable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!result ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                {preview.mode.toUpperCase()} MODE
              </span>
              <span className="text-xs text-zinc-400 nums">
                Quote expires in {timeLeft}s
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Order Confirmation Preview
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Orders require explicit two-step confirmation. No automated execution.
            </p>

            {/* Order Details Card */}
            <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Instrument:</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {preview.order.token} ({preview.order.ticker})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Side:</span>
                <span className="uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  {preview.order.side}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Amount USD:</span>
                <span className="font-bold text-zinc-900 dark:text-white nums">
                  ${preview.order.amount_usd.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Safety Cap ({preview.cap.max_usd} max):</span>
                <span className={`font-semibold ${preview.cap.within_cap ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {preview.cap.within_cap ? 'Within Limits' : 'Cap Exceeded'}
                </span>
              </div>
            </div>

            {/* Price Change Warning */}
            {preview.changed && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Conditions shifted since review: {preview.change_summary}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting || timeLeft === 0 || !preview.cap.within_cap}
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Placing...</span>
                  </>
                ) : (
                  <span>Confirm Order</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            {result.status === 'placed' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
                  Demo Order Placed
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {result.message}
                </p>
                {result.exchange_ref && (
                  <div className="mt-3 text-[11px] font-mono text-zinc-400">
                    Ref: {result.exchange_ref}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 mx-auto flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
                  Order Failed
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {result.message}
                </p>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
