'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Printer,
  Save,
  Loader2,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data?.order) {
          const ord = data.data.order;
          setOrder(ord);
          setOrderStatus(ord.orderStatus || 'confirmed');
          setPaymentStatus(ord.paymentStatus || 'pending');
          setTrackingNumber(ord.trackingNumber || '');
        }
      } catch (err) {
        console.warn('Could not fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleSaveStatus = async () => {
    setUpdating(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          trackingNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert(data.error || 'Failed to update order.');
      }
    } catch (err) {
      alert('Error updating order.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-card border border-border p-8">
        <p className="text-xs font-mono uppercase text-ink/60 mb-4">Order record not found.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 bg-ink text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-card border border-border text-ink hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-tan block">
              Order Fulfillment Record
            </span>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ink">
              #{order.orderNumber}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-surface border border-border hover:border-ink px-4 py-2 text-xs font-mono uppercase tracking-wider text-ink transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={handleSaveStatus}
            disabled={updating}
            className="inline-flex items-center gap-1.5 bg-ink hover:bg-ink/85 text-primary-bg px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
          >
            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5 text-tan" />
            )}
            <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Controller Box */}
      <div className="bg-card border border-border p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
            Order Fulfillment Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full bg-surface border border-border px-3 py-2 text-xs font-mono uppercase tracking-wider text-ink cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-surface border border-border px-3 py-2 text-xs font-mono uppercase tracking-wider text-ink cursor-pointer"
          >
            <option value="pending">Pending (COD / Unpaid)</option>
            <option value="paid">Paid (Verified)</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
            Courier Tracking Number
          </label>
          <input
            type="text"
            placeholder="e.g. 1Z9999999999999999"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full bg-surface border border-border px-3 py-2 text-xs font-mono text-ink"
          />
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-card border border-border p-8 sm:p-12 space-y-8" id="invoice-printable">
        {/* Invoice Top */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b border-border gap-6">
          <div>
            <h2 className="font-display text-4xl uppercase tracking-widest text-ink">
              URBAN FIT
            </h2>
            <p className="text-xs font-mono text-ink/60 mt-1">
              Minimalist Premium Streetwear Uniforms
            </p>
            <p className="text-xs font-mono text-ink/50 mt-0.5">
              452 Broadway, SoHo, NY 10013 • support@urbanfit.style
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <span className="font-bold text-ink uppercase text-sm block">
              OFFICIAL INVOICE
            </span>
            <p className="text-ink/80 mt-1">Order: #{order.orderNumber}</p>
            <p className="text-ink/60">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-ink/60">
              Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus?.toUpperCase()})
            </p>
          </div>
        </div>

        {/* Customer & Shipping Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-sans">
          <div>
            <h4 className="font-mono uppercase tracking-widest text-ink/50 text-[10px] mb-1 font-bold">
              Billed & Shipped To:
            </h4>
            <p className="font-bold text-ink uppercase tracking-wider">
              {order.shippingAddress?.fullName || order.customerName}
            </p>
            <p className="text-ink/80">{order.shippingAddress?.address}</p>
            <p className="text-ink/80">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.postalCode}
            </p>
            <p className="text-ink/80">{order.shippingAddress?.country}</p>
            <p className="font-mono text-ink/60 mt-1">Phone: {order.shippingAddress?.phone}</p>
            <p className="font-mono text-ink/60">Email: {order.userEmail}</p>
          </div>

          <div>
            <h4 className="font-mono uppercase tracking-widest text-ink/50 text-[10px] mb-1 font-bold">
              Fulfillment Summary:
            </h4>
            <p className="text-ink/80">
              Status:{' '}
              <strong className="uppercase text-ink font-mono">{order.orderStatus}</strong>
            </p>
            {order.trackingNumber && (
              <p className="text-ink/80 font-mono mt-1">
                Tracking: <strong className="text-ink">{order.trackingNumber}</strong>
              </p>
            )}
            {order.customerNote && (
              <div className="mt-2 p-2 bg-surface border border-border text-[11px] font-mono">
                <span className="font-bold text-ink block">Customer Note:</span>
                <span className="text-ink/70">{order.customerNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ordered Line Items Table */}
        <div className="border border-border">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
              <tr>
                <th className="py-2.5 px-4">Item Description</th>
                <th className="py-2.5 px-4">Variant</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Unit Price</th>
                <th className="py-2.5 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 font-bold uppercase tracking-wider text-ink">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-ink/70 uppercase">
                    {item.size} / {item.color}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-tan font-bold">
                <span>Discount ({order.appliedCoupon || 'PROMO'})</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/70">
              <span>Shipping Fee</span>
              <span>
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink pt-3 border-t border-border">
              <span>Total Paid / Due</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-6 text-center text-[10px] font-mono text-ink/50 uppercase tracking-widest">
          Thank you for choosing URBAN FIT • Designed in Tokyo & New York
        </div>
      </div>
    </div>
  );
}
