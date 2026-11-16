'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Search,
  Eye,
  Loader2,
  Calendar,
  Filter,
} from 'lucide-react';

const STATUS_OPTIONS = ['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders?limit=100');
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o))
        );
      } else {
        alert(data.error || 'Failed to update order status.');
      }
    } catch (err) {
      alert('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (o.orderStatus || 'confirmed').toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Orders Fulfillment
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            {orders.length} Total orders recorded
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-ink text-primary-bg font-bold'
                  : 'bg-card border border-border text-ink hover:border-ink/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading orders queue...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-12 h-12 text-ink/20 mx-auto mb-3 stroke-1" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
              No orders found matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((o) => (
                  <tr key={o._id || o.orderNumber} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {o.orderNumber}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-ink uppercase tracking-wider">
                        {o.customerName || o.shippingAddress?.fullName || 'Guest'}
                      </p>
                      <p className="text-[10px] font-mono text-ink/50 truncate max-w-[160px]">
                        {o.userEmail}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/70">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 font-mono uppercase text-ink/70">
                      <span className="font-bold text-ink">{o.paymentMethod || 'COD'}</span>
                      <span className="text-[10px] text-ink/40 block">
                        {o.paymentStatus || 'pending'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {formatPrice(o.total)}
                    </td>

                    {/* Quick status dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={o.orderStatus || 'confirmed'}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 border cursor-pointer ${
                          o.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.orderStatus === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : o.orderStatus === 'cancelled'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o._id || o.orderNumber}`}
                        className="inline-flex items-center gap-1 text-tan hover:text-ink font-mono uppercase text-xs font-semibold underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
