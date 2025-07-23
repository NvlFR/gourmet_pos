import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InventoryFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  onBulkAction 
}) => {
  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'vegetables', label: 'Sayuran' },
    { value: 'meat', label: 'Daging' },
    { value: 'seafood', label: 'Makanan Laut' },
    { value: 'dairy', label: 'Produk Susu' },
    { value: 'grains', label: 'Biji-bijian' },
    { value: 'spices', label: 'Bumbu & Rempah' },
    { value: 'beverages', label: 'Minuman' },
    { value: 'frozen', label: 'Makanan Beku' }
  ];

  const suppliers = [
    { value: '', label: 'Semua Pemasok' },
    { value: 'PT Segar Nusantara', label: 'PT Segar Nusantara' },
    { value: 'CV Bahan Makanan Jaya', label: 'CV Bahan Makanan Jaya' },
    { value: 'Toko Sayur Berkah', label: 'Toko Sayur Berkah' },
    { value: 'PT Protein Prima', label: 'PT Protein Prima' },
    { value: 'UD Rempah Nusantara', label: 'UD Rempah Nusantara' }
  ];

  const stockStatuses = [
    { value: '', label: 'Semua Status' },
    { value: 'adequate', label: 'Stok Cukup' },
    { value: 'low', label: 'Stok Rendah' },
    { value: 'critical', label: 'Stok Kritis' }
  ];

  const bulkActions = [
    { value: 'export', label: 'Ekspor Data', icon: 'Download' },
    { value: 'update-prices', label: 'Update Harga', icon: 'DollarSign' },
    { value: 'adjust-stock', label: 'Penyesuaian Stok', icon: 'Package' },
    { value: 'generate-po', label: 'Buat Purchase Order', icon: 'ShoppingCart' },
    { value: 'delete', label: 'Hapus Item', icon: 'Trash2' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Cari nama bahan..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={filters.supplier}
          onChange={(e) => handleFilterChange('supplier', e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {suppliers.map(supplier => (
            <option key={supplier.value} value={supplier.value}>
              {supplier.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {stockStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tanggal Mulai
          </label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tanggal Akhir
          </label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rentang Nilai (IDR)
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minValue}
              onChange={(e) => handleFilterChange('minValue', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxValue}
              onChange={(e) => handleFilterChange('maxValue', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <select
            onChange={(e) => onBulkAction(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            defaultValue=""
          >
            <option value="" disabled>Aksi Massal</option>
            {bulkActions.map(action => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Hapus Filter
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Filter" size={16} />
          <span>
            {hasActiveFilters ? 'Filter aktif' : 'Tidak ada filter'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;