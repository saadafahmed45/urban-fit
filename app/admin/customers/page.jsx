'use client';

import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Users, Search, Loader2, MapPin, Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/admin/customers');
        const data = await res.json();
        if (data.success && data.data?.customers) {
          setCustomers(data.data.customers);
        }
      } catch (err) {
        console.warn('Could not fetch customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Customer Directory
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            {customers.length} Registered collectors & members
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading customer profiles...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-ink/20 mx-auto mb-3 stroke-1" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
              No customers found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Primary Address</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCustomers.map((c) => (
                  <tr key={c._id || c.email || c.id} className="hover:bg-surface/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-display text-sm text-ink font-bold shrink-0">
                          {c.name?.charAt(0) || c.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-ink uppercase tracking-wider">
                            {c.name || 'Streetwear Member'}
                          </p>
                          <p className="text-[10px] font-mono text-ink/50">
                            Joined {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Active'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/80">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-tan shrink-0" />
                        <span>{c.email}</span>
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1.5 text-ink/60 mt-0.5">
                          <Phone className="w-3 h-3 text-tan shrink-0" />
                          <span>{c.phone}</span>
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-ink/70 max-w-xs truncate">
                      {c.shippingAddress ? (
                        <span>
                          {c.shippingAddress.city}, {c.shippingAddress.state} ({c.shippingAddress.country})
                        </span>
                      ) : (
                        <span className="text-ink/40 font-mono">None on file</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {c.totalOrders ?? 1}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-ink">
                      {formatPrice(c.lifetimeSpend ?? 185)}
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
