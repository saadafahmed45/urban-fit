'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 shadow-lg">
        <p className="text-[11px] font-mono uppercase tracking-wider text-ink/60 mb-1">
          {label}
        </p>
        <p className="font-display text-lg text-ink">
          {formatPrice(payload[0].value)}
        </p>
        {payload[0].payload?.orders !== undefined && (
          <p className="text-[11px] font-mono text-tan font-bold">
            {payload[0].payload.orders} {payload[0].payload.orders === 1 ? 'Order' : 'Orders'}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function SalesChart({ data = [] }) {
  const chartData = data && data.length > 0
    ? data
    : [
        { date: 'Mon', sales: 0, orders: 0 },
        { date: 'Tue', sales: 0, orders: 0 },
        { date: 'Wed', sales: 0, orders: 0 },
        { date: 'Thu', sales: 0, orders: 0 },
        { date: 'Fri', sales: 0, orders: 0 },
        { date: 'Sat', sales: 0, orders: 0 },
        { date: 'Sun', sales: 0, orders: 0 },
      ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B38B66" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#B38B66" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E3DBD2" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#111111"
            opacity={0.5}
            tickLine={false}
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
          />
          <YAxis
            stroke="#111111"
            opacity={0.5}
            tickLine={false}
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#B38B66"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
