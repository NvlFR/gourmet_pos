import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryTable = ({ 
  items, 
  onItemClick, 
  selectedItems, 
  onSelectionChange,
  sortConfig,
  onSort 
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'adequate': return 'text-success';
      case 'low': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStockStatusBg = (status) => {
    switch (status) {
      case 'adequate': return 'bg-success/10';
      case 'low': return 'bg-warning/10';
      case 'critical': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'adequate': return 'Cukup';
      case 'low': return 'Rendah';
      case 'critical': return 'Kritis';
      default: return 'Normal';
    }
  };

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

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange(items.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleItemSelect = (itemId, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
      setSelectAll(false);
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const columns = [
    { key: 'name', label: 'Nama Bahan', sortable: true },
    { key: 'currentStock', label: 'Stok Saat Ini', sortable: true },
    { key: 'unit', label: 'Satuan', sortable: false },
    { key: 'supplier', label: 'Pemasok', sortable: true },
    { key: 'lastUpdated', label: 'Terakhir Diperbarui', sortable: true },
    { key: 'status', label: 'Status Stok', sortable: true },
    { key: 'value', label: 'Nilai (IDR)', sortable: true }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left">
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span>{column.label}</span>
                      <Icon 
                        name={getSortIcon(column.key)} 
                        size={14} 
                        className="text-muted-foreground"
                      />
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
              <th className="w-20 px-4 py-3 text-center">
                <span className="text-sm font-medium text-foreground">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground font-medium">
                    {item.currentStock.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{item.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{item.supplier}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.lastUpdated)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusBg(item.status)} ${getStockStatusColor(item.status)}`}>
                    {getStockStatusText(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(item.value)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onItemClick(item)}
                    className="w-8 h-8"
                  >
                    <Icon name="MoreHorizontal" size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Tidak Ada Data Inventori</h3>
          <p className="text-muted-foreground mb-4">
            Belum ada bahan baku yang ditambahkan ke sistem inventori.
          </p>
          <Button variant="default" iconName="Plus">
            Tambah Bahan Baku Pertama
          </Button>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;