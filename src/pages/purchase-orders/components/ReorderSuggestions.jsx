import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReorderSuggestions = ({ onCreateOrder }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const suggestions = [
    {
      id: 'sug001',
      materialId: 'mat004',
      materialName: 'Tomat Segar',
      currentStock: 2,
      minStock: 10,
      avgUsage: 15,
      daysLeft: 1,
      suggestedQuantity: 25,
      unit: 'kg',
      lastPrice: 8000,
      supplier: 'PT Sumber Makmur',
      priority: 'high'
    },
    {
      id: 'sug002',
      materialId: 'mat006',
      materialName: 'Cabai Merah',
      currentStock: 3,
      minStock: 8,
      avgUsage: 12,
      daysLeft: 2,
      suggestedQuantity: 20,
      unit: 'kg',
      lastPrice: 45000,
      supplier: 'CV Berkah Jaya',
      priority: 'high'
    },
    {
      id: 'sug003',
      materialId: 'mat007',
      materialName: 'Minyak Goreng',
      currentStock: 5,
      minStock: 12,
      avgUsage: 8,
      daysLeft: 4,
      suggestedQuantity: 15,
      unit: 'liter',
      lastPrice: 18000,
      supplier: 'UD Mitra Sejahtera',
      priority: 'medium'
    },
    {
      id: 'sug004',
      materialId: 'mat005',
      materialName: 'Bawang Merah',
      currentStock: 8,
      minStock: 15,
      avgUsage: 10,
      daysLeft: 5,
      suggestedQuantity: 20,
      unit: 'kg',
      lastPrice: 25000,
      supplier: 'PT Sumber Makmur',
      priority: 'medium'
    },
    {
      id: 'sug005',
      materialId: 'mat009',
      materialName: 'Gula Pasir',
      currentStock: 12,
      minStock: 20,
      avgUsage: 6,
      daysLeft: 8,
      suggestedQuantity: 25,
      unit: 'kg',
      lastPrice: 14000,
      supplier: 'PT Bahan Pangan Nusantara',
      priority: 'low'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/20 text-error';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  const handleItemSelect = (suggestionId) => {
    setSelectedItems(prev => {
      if (prev.includes(suggestionId)) {
        return prev.filter(id => id !== suggestionId);
      } else {
        return [...prev, suggestionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === suggestions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(suggestions.map(s => s.id));
    }
  };

  const handleCreateOrderFromSuggestions = () => {
    const selectedSuggestions = suggestions.filter(s => selectedItems.includes(s.id));
    onCreateOrder(selectedSuggestions);
  };

  const totalEstimatedCost = suggestions
    .filter(s => selectedItems.includes(s.id))
    .reduce((sum, item) => sum + (item.suggestedQuantity * item.lastPrice), 0);

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Saran Pemesanan Ulang</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Berdasarkan stok rendah dan pola penggunaan
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              iconName={selectedItems.length === suggestions.length ? "CheckSquare" : "Square"}
            >
              {selectedItems.length === suggestions.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </Button>
            
            {selectedItems.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateOrderFromSuggestions}
                iconName="ShoppingCart"
              >
                Buat Pesanan ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Semua Stok Aman</h4>
            <p className="text-muted-foreground">
              Tidak ada bahan yang memerlukan pemesanan ulang saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedItems.includes(suggestion.id)
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/20'
                }`}
                onClick={() => handleItemSelect(suggestion.id)}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="mt-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedItems.includes(suggestion.id)
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                    }`}>
                      {selectedItems.includes(suggestion.id) && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-foreground">{suggestion.materialName}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                            {getPriorityText(suggestion.priority)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Stok Saat Ini:</span>
                            <p className="font-medium text-foreground">
                              {suggestion.currentStock} {suggestion.unit}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stok Minimum:</span>
                            <p className="font-medium text-foreground">
                              {suggestion.minStock} {suggestion.unit}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sisa Hari:</span>
                            <p className={`font-medium ${
                              suggestion.daysLeft <= 2 ? 'text-error' : 
                              suggestion.daysLeft <= 5 ? 'text-warning' : 'text-success'
                            }`}>
                              {suggestion.daysLeft} hari
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pemasok:</span>
                            <p className="font-medium text-foreground">{suggestion.supplier}</p>
                          </div>
                        </div>
                      </div>

                      {/* Suggestion Details */}
                      <div className="text-right ml-4">
                        <div className="text-sm text-muted-foreground mb-1">Saran Pesan:</div>
                        <div className="font-medium text-foreground">
                          {suggestion.suggestedQuantity} {suggestion.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @ {formatCurrency(suggestion.lastPrice)}
                        </div>
                        <div className="font-medium text-primary mt-1">
                          {formatCurrency(suggestion.suggestedQuantity * suggestion.lastPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Indicator */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Level Stok</span>
                        <span>{Math.round((suggestion.currentStock / suggestion.minStock) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            suggestion.currentStock <= suggestion.minStock * 0.5 ? 'bg-error' :
                            suggestion.currentStock <= suggestion.minStock * 0.8 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{
                            width: `${Math.min((suggestion.currentStock / suggestion.minStock) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Items Summary */}
        {selectedItems.length > 0 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">
                  {selectedItems.length} item dipilih
                </h4>
                <p className="text-sm text-muted-foreground">
                  Estimasi total biaya
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(totalEstimatedCost)}
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateOrderFromSuggestions}
                  iconName="ArrowRight"
                  className="mt-2"
                >
                  Lanjut Buat Pesanan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReorderSuggestions;