import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrdersTable = () => {
  const recentOrders = [
    {
      id: 'ORD-001',
      table: 'Meja 5',
      items: ['Nasi Gudeg', 'Es Teh Manis'],
      total: 45000,
      status: 'completed',
      time: '14:30',
      paymentMethod: 'cash'
    },
    {
      id: 'ORD-002',
      table: 'Meja 12',
      items: ['Ayam Bakar', 'Nasi Putih', 'Es Jeruk'],
      total: 65000,
      status: 'in-progress',
      time: '14:25',
      paymentMethod: 'card'
    },
    {
      id: 'ORD-003',
      table: 'Takeaway',
      items: ['Soto Ayam', 'Kerupuk'],
      total: 35000,
      status: 'ready',
      time: '14:20',
      paymentMethod: 'digital'
    },
    {
      id: 'ORD-004',
      table: 'Meja 8',
      items: ['Gado-gado', 'Es Teh Tawar'],
      total: 28000,
      status: 'new',
      time: '14:15',
      paymentMethod: 'cash'
    },
    {
      id: 'ORD-005',
      table: 'Meja 3',
      items: ['Nasi Gudeg', 'Ayam Bakar', 'Es Jeruk'],
      total: 85000,
      status: 'completed',
      time: '14:10',
      paymentMethod: 'card'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { label: 'Baru', color: 'bg-primary/20 text-primary', icon: 'Clock' },
      'in-progress': { label: 'Diproses', color: 'bg-warning/20 text-warning', icon: 'ChefHat' },
      'ready': { label: 'Siap', color: 'bg-success/20 text-success', icon: 'CheckCircle' },
      'completed': { label: 'Selesai', color: 'bg-muted text-muted-foreground', icon: 'Check' }
    };

    const config = statusConfig[status] || statusConfig['new'];
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cash': return 'Banknote';
      case 'card': return 'CreditCard';
      case 'digital': return 'Smartphone';
      default: return 'DollarSign';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pesanan Terbaru</h3>
            <p className="text-sm text-muted-foreground">Aktivitas pesanan hari ini</p>
          </div>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            Lihat Semua
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID Pesanan</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Meja/Lokasi</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Item</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Waktu</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-foreground">{order.id}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{order.table}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="max-w-48">
                    <p className="text-sm text-foreground truncate">
                      {order.items.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    {formatCurrency(order.total)}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{order.time}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Icon name={getPaymentIcon(order.paymentMethod)} size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground capitalize">
                      {order.paymentMethod === 'cash' ? 'Tunai' : 
                       order.paymentMethod === 'card' ? 'Kartu' : 'Digital'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;