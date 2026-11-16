'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/layout/ShopLayout';
import AuthGuard from '@/components/account/AuthGuard';
import AccountNav from '@/components/account/AccountNav';
import { formatPrice } from '@/lib/utils';
import { Package, ArrowRight, ChevronRight, Loader2, Calendar } from 'lucide-react';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/mine');
        const data = await res.json();
        if (data.success && data.data?.orders) {
          setOrders(data.data.orders);
        }
      } catch (err) {
        console.warn('Orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => (o.orderStatus || 'confirmed').toLowerCase() === statusFilter.toLowerCase());

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGuard>
            {({ user }) => (
              <div>
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-border">
                  <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink mb-1">
                    Orders & Tracking
                  </h1>
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
                    Review and track all your previous drop orders.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <AccountNav user={user} />

                  <div className="flex-1 space-y-6">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
                      {['all', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setStatusFilter(tab)}
                          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                            statusFilter === tab
                              ? 'bg-ink text-primary-bg font-bold'
                              : 'bg-surface border border-border text-ink hover:border-ink/60'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {loading ? (
                      <div className="py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
                        <p className="text-xs font-mono uppercase text-ink/60">
                          Fetching your orders...
                        </p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="bg-card border border-border p-12 text-center">
                        <Package className="w-12 h-12 text-ink/20 mx-auto mb-4 stroke-1" />
                        <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-2">
                          No Orders Found
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-ink/60 mb-6">
                          {statusFilter === 'all'
                            ? "You haven't placed any streetwear orders yet."
                            : `No orders matching status "${statusFilter}".`}
                        </p>
                        <Link
                          href="/shop"
                          className="bg-ink text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-ink/85 transition-colors"
                        >
                          <span>Explore Drops</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <div
                            key={order._id || order.orderNumber}
                            className="bg-card border border-border p-6 space-y-4"
                          >
                            {/* Order Top Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-bold text-ink">
                                    {order.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold border ${
                                      order.orderStatus === 'delivered'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : order.orderStatus === 'shipped'
                                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                                        : order.orderStatus === 'cancelled'
                                        ? 'bg-red-50 text-red-800 border-red-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}
                                  >
                                    {order.orderStatus || 'confirmed'}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-ink/60 mt-0.5 block">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-display text-xl text-ink tracking-wider">
                                  {formatPrice(order.total)}
                                </span>
                                <Link
                                  href={`/account/orders/${order._id || order.orderNumber}`}
                                  className="inline-flex items-center gap-1.5 bg-surface border border-border hover:border-ink px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-ink transition-colors"
                                >
                                  <span>View Details</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>

                            {/* Items Thumbnails */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="relative w-12 h-14 bg-surface border border-border shrink-0 overflow-hidden">
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                      />
                                    ) : null}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-xs uppercase tracking-wider text-ink truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] font-mono text-ink/60">
                                      {item.size} • {item.color} • Qty {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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
