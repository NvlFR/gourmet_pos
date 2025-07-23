import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LowStockAlert = () => {
  const lowStockItems = [
    {
      id: 1,
      name: 'Tomat',
      currentStock: 5,
      minStock: 20,
      unit: 'kg',
      category: 'Sayuran',
      urgency: 'critical',
      supplier: 'Toko Sayur Segar'
    },
    {
      id: 2,
      name: 'Beras Premium',
      currentStock: 8,
      minStock: 25,
      unit: 'kg',
      category: 'Bahan Pokok',
      urgency: 'high',
      supplier: 'CV Beras Jaya'
    },
    {
      id: 3,
      name: 'Minyak Goreng',
      currentStock: 12,
      minStock: 30,
      unit: 'liter',
      category: 'Minyak',
      urgency: 'medium',
      supplier: 'Distributor Minyak'
    },
    {
      id: 4,
      name: 'Gula Pasir',
      currentStock: 15,
      minStock: 40,
      unit: 'kg',
      category: 'Bumbu',
      urgency: 'medium',
      supplier: 'Toko Grosir Manis'
    },
    {
      id: 5,
      name: 'Telur Ayam',
      currentStock: 3,
      minStock: 10,
      unit: 'kg',
      category: 'Protein',
      urgency: 'critical',
      supplier: 'Peternakan Sejahtera'
    }
  ];

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'AlertTriangle',
          label: 'Kritis'
        };
      case 'high':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'AlertCircle',
          label: 'Tinggi'
        };
      default:
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          icon: 'Info',
          label: 'Sedang'
        };
    }
  };

  const getStockPercentage = (current, min) => {
    return Math.round((current / min) * 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Peringatan Stok</h3>
            <p className="text-sm text-muted-foreground">Item dengan stok rendah</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-error">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">{lowStockItems.filter(item => item.urgency === 'critical').length}</span>
            </div>
            <Button variant="outline" size="sm" iconName="Settings">
              Atur Alert
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {lowStockItems.map((item) => {
          const urgencyConfig = getUrgencyConfig(item.urgency);
          const stockPercentage = getStockPercentage(item.currentStock, item.minStock);
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${urgencyConfig.bgColor} ${urgencyConfig.borderColor} hover:shadow-elevation-1 transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${urgencyConfig.bgColor} border ${urgencyConfig.borderColor}`}>
                    <Icon name={urgencyConfig.icon} size={16} className={urgencyConfig.color} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig.color} ${urgencyConfig.bgColor}`}>
                  {urgencyConfig.label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stok Saat Ini:</span>
                  <span className="font-medium text-foreground">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Stok:</span>
                  <span className="font-medium text-foreground">
                    {item.minStock} {item.unit}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stockPercentage <= 25 ? 'bg-error' :
                      stockPercentage <= 50 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stockPercentage}% dari minimum</span>
                  <span className="text-muted-foreground">{item.supplier}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <Button variant="outline" size="sm" iconName="ShoppingCart" className="flex-1">
                  Pesan Ulang
                </Button>
                <Button variant="ghost" size="sm" iconName="Eye">
                  Detail
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="default" size="sm" fullWidth iconName="Package">
          Kelola Semua Inventori
        </Button>
      </div>
    </div>
  );
};

export default LowStockAlert;