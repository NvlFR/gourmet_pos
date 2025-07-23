import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderDetailsModal = ({ order, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !order) return null;

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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Detail Pesanan Pembelian</h2>
              <p className="text-muted-foreground mt-1">#{order.poNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Supplier Info */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Informasi Pemasok</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nama Pemasok</label>
                    <p className="text-foreground mt-1">{order.supplier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Kontak</label>
                    <p className="text-foreground mt-1">{order.supplierContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tanggal Pesanan</label>
                    <p className="text-foreground mt-1">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tanggal Pengiriman</label>
                    <p className="text-foreground mt-1">{formatDate(order.expectedDelivery)}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                    <p className="text-foreground mt-1">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Item Pesanan</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Bahan</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Jumlah</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Harga Satuan</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-b-0">
                          <td className="py-3">
                            <div className="text-foreground font-medium">{item.materialName}</div>
                            <div className="text-sm text-muted-foreground">ID: {item.materialId}</div>
                          </td>
                          <td className="py-3 text-right text-foreground">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 text-right text-foreground">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="py-3 text-right font-medium text-foreground">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Riwayat Pesanan</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Pesanan dibuat</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)} - 09:30</p>
                    </div>
                  </div>
                  {order.status !== 'pending' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Pesanan dikirim ke pemasok</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)} - 10:15</p>
                      </div>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Pesanan dikonfirmasi pemasok</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.orderDate)} - 14:20</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-0">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-4">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">{formatCurrency(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PPN (11%):</span>
                      <span className="text-foreground">{formatCurrency(order.tax || 0)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground">Total:</span>
                        <span className="font-bold text-foreground text-lg">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {order.status === 'pending' && (
                      <>
                        <Button variant="default" fullWidth onClick={() => onEdit(order)}>
                          Edit Pesanan
                        </Button>
                        <Button variant="success" fullWidth>
                          Kirim ke Pemasok
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'sent' && (
                      <Button variant="success" fullWidth>
                        Tandai Dikonfirmasi
                      </Button>
                    )}

                    {order.status === 'confirmed' && (
                      <Button variant="success" fullWidth>
                        Terima Barang
                      </Button>
                    )}

                    <Button variant="outline" fullWidth iconName="Printer">
                      Cetak PO
                    </Button>
                    
                    <Button variant="outline" fullWidth iconName="Download">
                      Unduh PDF
                    </Button>

                    {(order.status === 'pending' || order.status === 'sent') && (
                      <Button 
                        variant="destructive" 
                        fullWidth 
                        onClick={() => onDelete(order)}
                      >
                        Batalkan Pesanan
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 bg-muted/20 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Statistik Cepat</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Item:</span>
                      <span className="text-foreground">{order.itemCount} item</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rata-rata per Item:</span>
                      <span className="text-foreground">
                        {formatCurrency(order.totalAmount / (order.itemCount || 1))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;