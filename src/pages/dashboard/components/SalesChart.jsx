import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const SalesChart = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const salesData = [
    { date: '17/01', sales: 2400000, orders: 45 },
    { date: '18/01', sales: 1800000, orders: 32 },
    { date: '19/01', sales: 3200000, orders: 58 },
    { date: '20/01', sales: 2800000, orders: 49 },
    { date: '21/01', sales: 4100000, orders: 72 },
    { date: '22/01', sales: 3600000, orders: 64 },
    { date: '23/01', sales: 4500000, orders: 81 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Tanggal: ${label}`}</p>
          <p className="text-sm text-success">
            {`Penjualan: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-sm text-primary">
            {`Pesanan: ${payload[0].payload.orders}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tren Penjualan</h3>
          <p className="text-sm text-muted-foreground">Grafik penjualan harian</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Hari
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Hari
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Hari
          </Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#A0AEC0"
              fontSize={12}
            />
            <YAxis 
              stroke="#A0AEC0"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#4299E1" 
              strokeWidth={3}
              dot={{ fill: '#4299E1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4299E1', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;