'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SalesChart from '@/components/admin/SalesChart';
import { formatPrice } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const resData = await res.json();
        if (resData.success && resData.data) {
          setData(resData.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
          Compiling store analytics...
        </p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];
  const chartData = data?.chartData || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink mb-1">
          Store Overview
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
          Real-time metrics, active drop inventory, and revenue tracking.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-card border border-border p-5 space-y-2">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-[11px] font-mono uppercase tracking-widest">
              Total Revenue
            </span>
            <DollarSign className="w-4 h-4 text-tan" />
          </div>
          <div className="font-display text-3xl text-ink tracking-wider">
            {formatPrice(metrics.totalRevenue)}
          </div>
          <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Lifetime Gross
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-card border border-border p-5 space-y-2">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-[11px] font-mono uppercase tracking-widest">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-tan" />
          </div>
          <div className="font-display text-3xl text-ink tracking-wider">
            {metrics.totalOrders}
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-tan hover:text-ink"
          >
            <span>Manage Orders</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Customers */}
        <div className="bg-card border border-border p-5 space-y-2">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-[11px] font-mono uppercase tracking-widest">
              Active Members
            </span>
            <Users className="w-4 h-4 text-tan" />
          </div>
          <div className="font-display text-3xl text-ink tracking-wider">
            {metrics.totalCustomers}
          </div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-tan hover:text-ink"
          >
            <span>Customer Directory</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card border border-border p-5 space-y-2">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-[11px] font-mono uppercase tracking-widest">
              Low Stock Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display text-3xl text-ink tracking-wider">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] font-mono text-amber-700">
            {metrics.lowStockCount > 0 ? 'Items below 10 units' : 'Inventory healthy'}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Sales Revenue (Last 7 Days)
            </h3>
            <p className="text-[11px] font-mono text-ink/60">
              Daily gross sales volume in USD
            </p>
          </div>
        </div>
        <SalesChart data={chartData} />
      </div>

      {/* Two Columns: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-card border border-border p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-mono uppercase tracking-wider text-tan hover:text-ink underline"
            >
              View All ({metrics.totalOrders})
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs font-mono uppercase tracking-widest text-ink/50 py-8 text-center">
              No orders placed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border font-mono uppercase text-ink/50">
                  <tr>
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order) => (
                    <tr key={order._id || order.orderNumber} className="hover:bg-surface/50">
                      <td className="py-3 px-3 font-mono font-bold text-ink">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-ink truncate max-w-[140px]">
                          {order.customerName || order.shippingAddress?.fullName || 'Guest'}
                        </p>
                        <p className="text-[10px] font-mono text-ink/50 truncate max-w-[140px]">
                          {order.userEmail}
                        </p>
                      </td>
                      <td className="py-3 px-3">
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
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-ink">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/orders/${order._id || order.orderNumber}`}
                          className="text-tan hover:text-ink font-mono uppercase text-[11px] underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="lg:col-span-4 bg-card border border-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink">
              Stock Warnings
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-mono uppercase tracking-wider text-tan hover:text-ink"
            >
              Inventory
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs font-mono uppercase text-ink/50 py-6 text-center">
              All product stock levels are above threshold.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {lowStockProducts.map((p) => (
                <div
                  key={p._id || p.slug}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-ink uppercase tracking-wider truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-mono text-ink/60">
                      {p.category} • {formatPrice(p.price)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-red-600 block">
                      {p.stock} Left
                    </span>
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="text-[10px] font-mono text-tan hover:text-ink underline uppercase"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
