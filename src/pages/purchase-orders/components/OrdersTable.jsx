import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrdersTable = ({ orders, onViewOrder, onEditOrder, onDeleteOrder }) => {
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning';
      case 'sent': return 'bg-primary/20 text-primary';
      case 'confirmed': return 'bg-success/20 text-success';
      case 'delivered': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-error/20 text-error';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'sent': return 'Terkirim';
      case 'confirmed': return 'Dikonfirmasi';
      case 'delivered': return 'Diterima';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'orderDate' || sortField === 'expectedDelivery') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header with Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Pesanan Pembelian Aktif</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary text-sm font-medium rounded">
              {sortedOrders.length} pesanan
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="sent">Terkirim</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="delivered">Diterima</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            
            <Button variant="outline" size="sm" iconName="Download">
              Ekspor
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('poNumber')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>No. PO</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('supplier')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Pemasok</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('orderDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Tgl Pesan</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('expectedDelivery')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Tgl Kirim</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Total</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-muted-foreground">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{order.poNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{order.supplier}</div>
                  <div className="text-sm text-muted-foreground">{order.supplierContact}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{formatDate(order.orderDate)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{formatDate(order.expectedDelivery)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{formatCurrency(order.totalAmount)}</div>
                  <div className="text-sm text-muted-foreground">{order.itemCount} item</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewOrder(order)}
                      className="w-8 h-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditOrder(order)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteOrder(order)}
                      className="w-8 h-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedOrders.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada pesanan pembelian</h3>
          <p className="text-muted-foreground">Belum ada pesanan pembelian yang dibuat.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;