'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/layout/ShopLayout';
import AuthGuard from '@/components/account/AuthGuard';
import AccountNav from '@/components/account/AccountNav';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Printer,
  Loader2,
  Clock,
} from 'lucide-react';

const TRACKING_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.warn('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const currentStatus = (order?.orderStatus || 'confirmed').toLowerCase();
  const currentStepIndex = Math.max(0, TRACKING_STEPS.indexOf(currentStatus));

  const handlePrint = () => {
    window.print();
  };

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGuard>
            {({ user }) => (
              <div>
                {/* Back Button */}
                <div className="mb-6">
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Orders</span>
                  </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <AccountNav user={user} />

                  <div className="flex-1 space-y-8">
                    {loading ? (
                      <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
                        <p className="text-xs font-mono uppercase text-ink/60">
                          Loading order details...
                        </p>
                      </div>
                    ) : !order ? (
                      <div className="bg-card border border-border p-12 text-center">
                        <h3 className="font-display text-2xl uppercase tracking-wider text-ink mb-2">
                          Order Not Found
                        </h3>
                        <p className="text-xs font-mono text-ink/60 uppercase tracking-wider mb-6">
                          We couldn't locate order #{orderId}.
                        </p>
                        <Link
                          href="/account/orders"
                          className="bg-ink text-primary-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
                        >
                          Return to Orders
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Order Header Card */}
                        <div className="bg-card border border-border p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-tan block mb-1">
                                Order Details
                              </span>
                              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ink">
                                #{order.orderNumber}
                              </h2>
                              <p className="text-xs font-mono text-ink/60 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>

                            <button
                              onClick={handlePrint}
                              className="inline-flex items-center gap-2 bg-surface border border-border hover:border-ink px-4 py-2 text-xs font-mono uppercase tracking-wider text-ink transition-colors self-start sm:self-auto cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print Invoice</span>
                            </button>
                          </div>

                          {/* Tracking Stepper Progress */}
                          <div className="py-4">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-ink mb-6">
                              Shipment Progress
                            </h4>
                            <div className="relative">
                              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
                              <div
                                className="absolute top-1/2 left-0 h-0.5 bg-ink -translate-y-1/2 z-0 transition-all duration-500"
                                style={{
                                  width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%`,
                                }}
                              />

                              <div className="relative z-10 flex justify-between">
                                {TRACKING_STEPS.map((step, idx) => {
                                  const isDone = idx <= currentStepIndex;
                                  return (
                                    <div
                                      key={step}
                                      className="flex flex-col items-center text-center bg-card px-2"
                                    >
                                      <div
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                                          isDone
                                            ? 'bg-ink text-primary-bg border-ink'
                                            : 'bg-card text-ink/40 border-border'
                                        }`}
                                      >
                                        {idx + 1}
                                      </div>
                                      <span
                                        className={`mt-2 text-[10px] font-mono uppercase tracking-wider font-bold ${
                                          isDone ? 'text-ink' : 'text-ink/40'
                                        }`}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="bg-card border border-border p-6 sm:p-8">
                          <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-4 pb-3 border-b border-border">
                            Ordered Items ({order.items?.length || 0})
                          </h3>

                          <div className="divide-y divide-border/60">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative w-16 h-20 bg-surface border border-border shrink-0 overflow-hidden">
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                      />
                                    ) : null}
                                  </div>
                                  <div>
                                    <h4 className="font-display text-base uppercase tracking-wider text-ink">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs font-mono text-ink/60 uppercase mt-0.5">
                                      Size: {item.size} • Color: {item.color}
                                    </p>
                                    <p className="text-xs font-mono text-ink/80 mt-1">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>

                                <div className="font-display text-lg text-ink tracking-wider text-right">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Two Columns: Delivery Address & Receipt Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Shipping Details */}
                          <div className="bg-card border border-border p-6">
                            <h4 className="font-display text-lg uppercase tracking-wider text-ink mb-3 pb-2 border-b border-border flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-tan" />
                              Shipping Address
                            </h4>
                            <div className="text-xs font-sans text-ink/80 space-y-1">
                              <p className="font-bold text-ink">{order.shippingAddress?.fullName}</p>
                              <p>{order.shippingAddress?.address}</p>
                              <p>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                                {order.shippingAddress?.postalCode}
                              </p>
                              <p>{order.shippingAddress?.country}</p>
                              <p className="font-mono text-ink/60 pt-2">
                                Phone: {order.shippingAddress?.phone}
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border/60">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-ink/50 block mb-1">
                                Payment Method
                              </span>
                              <p className="text-xs font-mono font-bold uppercase text-ink">
                                {order.paymentMethod === 'cod'
                                  ? 'Cash on Delivery (COD)'
                                  : 'Credit / Debit Card'}
                              </p>
                            </div>
                          </div>

                          {/* Pricing Summary */}
                          <div className="bg-card border border-border p-6 space-y-3">
                            <h4 className="font-display text-lg uppercase tracking-wider text-ink mb-3 pb-2 border-b border-border">
                              Payment Summary
                            </h4>
                            <div className="space-y-2 text-xs font-mono text-ink/80">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                              </div>
                              {order.discountAmount > 0 && (
                                <div className="flex justify-between text-tan font-bold">
                                  <span>Discount ({order.appliedCoupon || 'PROMO'})</span>
                                  <span>-{formatPrice(order.discountAmount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-sm text-ink pt-3 border-t border-border">
                                <span>Total Paid / Due</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AuthGuard>
        </div>
      </div>
    </ShopLayout>
  );
}
