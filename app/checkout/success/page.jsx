'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ShopLayout from '@/components/layout/ShopLayout';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Calendar, MapPin, ReceiptText } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'UF-ORDER-CONFIRMED';
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data?.order) {
          setOrder(data.data.order);
        }
      } catch (err) {
        console.warn('Could not fetch order snapshot:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto py-12 md:py-20 px-4 sm:px-6">
      {/* Confirmation Card */}
      <div className="bg-card border border-border p-8 md:p-12 text-center mb-8">
        <div className="w-16 h-16 bg-tan/15 text-tan rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-2">
          Thank you for your order
        </span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-3">
          Order Confirmed
        </h1>
        <p className="text-xs font-sans text-ink/70 max-w-md mx-auto mb-6 leading-relaxed">
          We’ve received your order and our fulfillment team is preparing your garments. A confirmation with tracking details has been sent to your email.
        </p>

        {/* Order Reference Pill */}
        <div className="inline-flex items-center gap-3 bg-surface border border-border px-5 py-2.5 mb-8">
          <span className="text-xs font-mono text-ink/60 uppercase tracking-widest">
            Order Reference:
          </span>
          <span className="font-mono text-sm font-bold text-ink tracking-wider">
            {orderNumber}
          </span>
        </div>

        {/* Timeline Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-border pt-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-tan shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink/50">
                Estimated Delivery
              </p>
              <p className="text-xs font-bold text-ink">3 - 5 Business Days</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-tan shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink/50">
                Shipping Carrier
              </p>
              <p className="text-xs font-bold text-ink">DHL / UPS Express Ground</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ReceiptText className="w-5 h-5 text-tan shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink/50">
                Order Status
              </p>
              <p className="text-xs font-bold text-emerald-700 uppercase">Confirmed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Itemized Summary (if loaded) */}
      {order && (
        <div className="bg-card border border-border p-6 mb-8">
          <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-4 pb-3 border-b border-border">
            Order Receipt
          </h3>
          <div className="divide-y divide-border/60">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-ink uppercase tracking-wider">{item.name}</p>
                  <p className="font-mono text-ink/60">
                    {item.size} • {item.color} • Qty {item.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-tan font-bold">
                <span>Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-ink pt-2 border-t border-border">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink text-primary-bg px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-ink/85 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface border border-border text-ink px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:border-ink transition-colors"
        >
          <span>View Account & Orders</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-tan border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </ShopLayout>
  );
}
