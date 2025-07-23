import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ItemDetailModal = ({ item, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(item || {});

  if (!isOpen || !item) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const stockHistory = [
    {
      id: 1,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'in',
      quantity: 50,
      unit: 'kg',
      reference: 'PO-2024-001',
      user: 'Admin',
      notes: 'Pembelian rutin mingguan'
    },
    {
      id: 2,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'out',
      quantity: -25,
      unit: 'kg',
      reference: 'ORDER-12345',
      user: 'Sistem POS',
      notes: 'Penjualan otomatis'
    },
    {
      id: 3,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'adjustment',
      quantity: -2,
      unit: 'kg',
      reference: 'ADJ-001',
      user: 'Manager',
      notes: 'Penyesuaian karena kerusakan'
    }
  ];

  const usageAnalytics = {
    dailyAverage: 8.5,
    weeklyTrend: '+12%',
    monthlyUsage: 255,
    predictedRunOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    topRecipes: [
      { name: 'Nasi Gudeg Spesial', usage: 45, percentage: 35 },
      { name: 'Ayam Bakar Bumbu Rujak', usage: 32, percentage: 25 },
      { name: 'Soto Ayam Lamongan', usage: 28, percentage: 22 }
    ]
  };

  const tabs = [
    { id: 'basic', label: 'Info Dasar', icon: 'Info' },
    { id: 'history', label: 'Riwayat Stok', icon: 'History' },
    { id: 'supplier', label: 'Pemasok', icon: 'Truck' },
    { id: 'analytics', label: 'Analitik', icon: 'BarChart3' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setEditMode(false);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'adequate': return 'text-success bg-success/10';
      case 'low': return 'text-warning bg-warning/10';
      case 'critical': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'adequate': return 'Stok Cukup';
      case 'low': return 'Stok Rendah';
      case 'critical': return 'Stok Kritis';
      default: return 'Normal';
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Nama Bahan"
            value={editMode ? formData.name : item.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Input
            label="Kategori"
            value={editMode ? formData.category : item.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Input
            label="Stok Saat Ini"
            type="number"
            value={editMode ? formData.currentStock : item.currentStock}
            onChange={(e) => handleInputChange('currentStock', parseFloat(e.target.value))}
            disabled={!editMode}
          />
        </div>
        <div>
          <Input
            label="Satuan"
            value={editMode ? formData.unit : item.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Input
            label="Stok Minimum"
            type="number"
            value={editMode ? formData.minStock : item.minStock}
            onChange={(e) => handleInputChange('minStock', parseFloat(e.target.value))}
            disabled={!editMode}
          />
        </div>
        <div>
          <Input
            label="Harga per Unit (IDR)"
            type="number"
            value={editMode ? formData.unitPrice : item.unitPrice}
            onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value))}
            disabled={!editMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Package" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Status Stok</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
            {getStockStatusText(item.status)}
          </span>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Total Nilai</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(item.value)}
          </p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Terakhir Update</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(item.lastUpdated)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStockHistory = () => (
    <div className="space-y-4">
      {stockHistory.map((entry) => (
        <div key={entry.id} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            entry.type === 'in' ? 'bg-success/20 text-success' :
            entry.type === 'out'? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
          }`}>
            <Icon 
              name={entry.type === 'in' ? 'ArrowUp' : entry.type === 'out' ? 'ArrowDown' : 'Edit'} 
              size={16} 
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-foreground">
                {entry.type === 'in' ? 'Stok Masuk' : entry.type === 'out' ? 'Stok Keluar' : 'Penyesuaian'}
              </p>
              <span className="text-sm text-muted-foreground">
                {formatDate(entry.date)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {entry.quantity > 0 ? '+' : ''}{entry.quantity} {entry.unit} • {entry.reference}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.notes} • oleh {entry.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSupplierInfo = () => (
    <div className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">Informasi Pemasok</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nama Pemasok</label>
            <p className="text-sm text-muted-foreground">{item.supplier}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Kontak</label>
            <p className="text-sm text-muted-foreground">+62 21 1234 5678</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <p className="text-sm text-muted-foreground">supplier@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Lead Time</label>
            <p className="text-sm text-muted-foreground">2-3 hari kerja</p>
          </div>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">Riwayat Pembelian</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Pembelian Terakhir</span>
            <span className="text-sm text-muted-foreground">23/07/2024</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Total Pembelian (30 hari)</span>
            <span className="text-sm font-medium text-foreground">150 kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Rata-rata Harga</span>
            <span className="text-sm font-medium text-foreground">{formatCurrency(item.unitPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Penggunaan Harian</h4>
          <p className="text-2xl font-bold text-foreground">{usageAnalytics.dailyAverage} kg</p>
          <p className="text-xs text-muted-foreground">Rata-rata per hari</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Tren Mingguan</h4>
          <p className="text-2xl font-bold text-success">{usageAnalytics.weeklyTrend}</p>
          <p className="text-xs text-muted-foreground">Dibanding minggu lalu</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Penggunaan Bulanan</h4>
          <p className="text-2xl font-bold text-foreground">{usageAnalytics.monthlyUsage} kg</p>
          <p className="text-xs text-muted-foreground">Total bulan ini</p>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Prediksi Habis</h4>
          <p className="text-2xl font-bold text-warning">7 hari</p>
          <p className="text-xs text-muted-foreground">Berdasarkan penggunaan saat ini</p>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">Resep Teratas</h4>
        <div className="space-y-3">
          {usageAnalytics.topRecipes.map((recipe, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{recipe.name}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${recipe.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-foreground">{recipe.usage} kg</p>
                <p className="text-xs text-muted-foreground">{recipe.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1002] flex items-center justify-center p-4">
      <div className="bg-popover border border-border rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-popover-foreground">{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!editMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
                iconName="Edit"
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  iconName="Save"
                >
                  Simpan
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'history' && renderStockHistory()}
          {activeTab === 'supplier' && renderSupplierInfo()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;