'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ShopLayout from '@/components/layout/ShopLayout';
import AuthGuard from '@/components/account/AuthGuard';
import AccountNav from '@/components/account/AccountNav';
import { useWishlistStore } from '@/store/wishlist';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  Heart,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AccountDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await fetch('/api/orders/mine');
        const data = await res.json();
        if (data.success && data.data?.orders) {
          setOrders(data.data.orders);
        }
      } catch (e) {
        console.warn('Could not fetch orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchRecentOrders();
  }, []);

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGuard>
            {({ user }) => (
              <div>
                {/* Header Banner */}
                <div className="pb-6 mb-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink">
                      Member Dashboard
                    </h1>
                    <p className="text-xs font-mono uppercase tracking-widest text-ink/60 mt-1">
                      Welcome back, {user?.displayName || user?.email || 'Streetwear Collector'}
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-ink text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/85 transition-colors self-start sm:self-auto"
                  >
                    <span>Browse New Drops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Account Nav Sidebar */}
                  <AccountNav user={user} />

                  {/* Main Content Area */}
                  <div className="flex-1 space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Total Orders Card */}
                      <div className="bg-card border border-border p-5">
                        <div className="flex items-center justify-between text-ink/50 mb-3">
                          <span className="text-[11px] font-mono uppercase tracking-widest">
                            Total Orders
                          </span>
                          <Package className="w-4 h-4 text-tan" />
                        </div>
                        <div className="font-display text-3xl text-ink tracking-wider">
                          {orders.length}
                        </div>
                        <Link
                          href="/account/orders"
                          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-tan hover:text-ink mt-3"
                        >
                          <span>View History</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Saved Wishlist Card */}
                      <div className="bg-card border border-border p-5">
                        <div className="flex items-center justify-between text-ink/50 mb-3">
                          <span className="text-[11px] font-mono uppercase tracking-widest">
                            Wishlist Items
                          </span>
                          <Heart className="w-4 h-4 text-tan" />
                        </div>
                        <div className="font-display text-3xl text-ink tracking-wider">
                          {wishlistItems.length}
                        </div>
                        <Link
                          href="/account/wishlist"
                          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-tan hover:text-ink mt-3"
                        >
                          <span>View Saved Drops</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Membership Tier Card */}
                      <div className="bg-card border border-border p-5">
                        <div className="flex items-center justify-between text-ink/50 mb-3">
                          <span className="text-[11px] font-mono uppercase tracking-widest">
                            Member Status
                          </span>
                          <ShieldCheck className="w-4 h-4 text-tan" />
                        </div>
                        <div className="font-display text-2xl text-ink tracking-wider">
                          URBAN BLACK
                        </div>
                        <p className="text-[11px] font-mono text-emerald-700 font-bold mt-3">
                          Free Priority Shipping Active
                        </p>
                      </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="bg-card border border-border p-6">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                        <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                          Recent Orders
                        </h3>
                        <Link
                          href="/account/orders"
                          className="text-xs font-mono uppercase tracking-wider text-tan hover:text-ink underline"
                        >
                          View All ({orders.length})
                        </Link>
                      </div>

                      {loadingOrders ? (
                        <div className="py-8 text-center text-xs font-mono uppercase text-ink/50">
                          Loading orders...
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="py-12 text-center">
                          <Package className="w-10 h-10 mx-auto text-ink/20 mb-3 stroke-1" />
                          <p className="text-xs font-mono uppercase tracking-wider text-ink/60 mb-4">
                            You haven't placed any orders yet.
                          </p>
                          <Link
                            href="/shop"
                            className="bg-ink text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/85 transition-colors inline-block"
                          >
                            Explore Latest Collection
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/60">
                          {orders.slice(0, 3).map((order) => (
                            <div
                              key={order._id || order.orderNumber}
                              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-xs font-bold text-ink">
                                    {order.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold ${
                                      order.orderStatus === 'delivered'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}
                                  >
                                    {order.orderStatus || 'confirmed'}
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-ink/60">
                                  {order.items?.length || 1} items • Placed on{' '}
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4">
                                <span className="font-mono text-sm font-bold text-ink">
                                  {formatPrice(order.total)}
                                </span>
                                <Link
                                  href={`/account/orders/${order._id || order.orderNumber}`}
                                  className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-tan hover:text-ink font-semibold"
                                >
                                  <span>Details</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
