import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const TopItemsChart = () => {
  const topItems = [
    { name: 'Nasi Gudeg', value: 35, sales: 1250000, color: '#4299E1' },
    { name: 'Ayam Bakar', value: 25, sales: 890000, color: '#48BB78' },
    { name: 'Soto Ayam', value: 20, sales: 720000, color: '#ED8936' },
    { name: 'Gado-gado', value: 12, sales: 430000, color: '#38B2AC' },
    { name: 'Lainnya', value: 8, sales: 290000, color: '#718096' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-1">{data.name}</p>
          <p className="text-sm text-primary">{`${data.value}% dari total`}</p>
          <p className="text-sm text-success">{formatCurrency(data.sales)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-foreground">{entry.value}</span>
            </div>
            <span className="text-muted-foreground">{entry.payload.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Menu Terlaris</h3>
          <p className="text-sm text-muted-foreground">Berdasarkan jumlah pesanan</p>
        </div>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topItems}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {topItems.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopItemsChart;