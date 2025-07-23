import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventorySummary = ({ summaryData, onAddItem, onGeneratePO }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Item',
      value: summaryData.totalItems.toLocaleString('id-ID'),
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Bahan baku terdaftar'
    },
    {
      title: 'Stok Rendah',
      value: summaryData.lowStockItems.toLocaleString('id-ID'),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Item perlu diisi ulang'
    },
    {
      title: 'Stok Kritis',
      value: summaryData.criticalStockItems.toLocaleString('id-ID'),
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Item segera habis'
    },
    {
      title: 'Total Nilai',
      value: formatCurrency(summaryData.totalValue),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Nilai inventori saat ini'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'stock_in',
      item: 'Daging Sapi Premium',
      quantity: 50,
      unit: 'kg',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: 'Admin'
    },
    {
      id: 2,
      type: 'stock_out',
      item: 'Tomat Segar',
      quantity: 15,
      unit: 'kg',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: 'Sistem POS'
    },
    {
      id: 3,
      type: 'adjustment',
      item: 'Bawang Merah',
      quantity: -5,
      unit: 'kg',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      user: 'Manager'
    },
    {
      id: 4,
      type: 'new_item',
      item: 'Keju Mozzarella',
      quantity: 20,
      unit: 'kg',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      user: 'Admin'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'stock_in': return 'ArrowUp';
      case 'stock_out': return 'ArrowDown';
      case 'adjustment': return 'Edit';
      case 'new_item': return 'Plus';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'stock_in': return 'text-success';
      case 'stock_out': return 'text-warning';
      case 'adjustment': return 'text-primary';
      case 'new_item': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'stock_in': return 'Stok Masuk';
      case 'stock_out': return 'Stok Keluar';
      case 'adjustment': return 'Penyesuaian';
      case 'new_item': return 'Item Baru';
      default: return 'Aktivitas';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return timestamp.toLocaleDateString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <Icon name={card.icon} size={20} className={card.color} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            onClick={onAddItem}
          >
            Tambah Bahan Baku
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={onGeneratePO}
          >
            Buat Purchase Order
          </Button>
          <Button
            variant="ghost"
            fullWidth
            iconName="Download"
            iconPosition="left"
          >
            Ekspor Laporan
          </Button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Aktivitas Terbaru</h3>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type)} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.item}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getActivityLabel(activity.type)} • {Math.abs(activity.quantity)} {activity.unit} • {activity.user}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            Lihat Semua Aktivitas
          </Button>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Peringatan Stok</h3>
          <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full">
            {summaryData.lowStockItems + summaryData.criticalStockItems} Item
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-warning/10 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-sm text-foreground">Stok Rendah</span>
            </div>
            <span className="text-sm font-medium text-warning">
              {summaryData.lowStockItems} item
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-error/10 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={14} className="text-error" />
              <span className="text-sm text-foreground">Stok Kritis</span>
            </div>
            <span className="text-sm font-medium text-error">
              {summaryData.criticalStockItems} item
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <Button variant="warning" size="sm" fullWidth iconName="ShoppingCart">
            Buat PO untuk Stok Rendah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;