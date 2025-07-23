import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import OrdersTable from './components/OrdersTable';
import CreateOrderForm from './components/CreateOrderForm';
import OrderDetailsModal from './components/OrderDetailsModal';
import ReorderSuggestions from './components/ReorderSuggestions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PurchaseOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active-orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 'po001',
      poNumber: 'PO-2025-001',
      supplier: 'PT Sumber Makmur',
      supplierContact: '021-12345678',
      orderDate: '2025-01-20',
      expectedDelivery: '2025-01-25',
      totalAmount: 2450000,
      itemCount: 5,
      status: 'confirmed',
      subtotal: 2207207,
      tax: 242793,
      notes: 'Pesanan rutin mingguan untuk bahan segar',
      items: [
        { materialId: 'mat004', materialName: 'Tomat Segar', quantity: 25, unit: 'kg', unitPrice: 8000, total: 200000 },
        { materialId: 'mat005', materialName: 'Bawang Merah', quantity: 15, unit: 'kg', unitPrice: 25000, total: 375000 },
        { materialId: 'mat001', materialName: 'Beras Premium', quantity: 50, unit: 'kg', unitPrice: 15000, total: 750000 },
        { materialId: 'mat008', materialName: 'Garam Dapur', quantity: 10, unit: 'kg', unitPrice: 5000, total: 50000 },
        { materialId: 'mat009', materialName: 'Gula Pasir', quantity: 20, unit: 'kg', unitPrice: 14000, total: 280000 }
      ]
    },
    {
      id: 'po002',
      poNumber: 'PO-2025-002',
      supplier: 'CV Berkah Jaya',
      supplierContact: '021-87654321',
      orderDate: '2025-01-21',
      expectedDelivery: '2025-01-26',
      totalAmount: 1887000,
      itemCount: 3,
      status: 'sent',
      subtotal: 1700000,
      tax: 187000,
      notes: 'Pesanan daging dan ayam untuk menu spesial',
      items: [
        { materialId: 'mat002', materialName: 'Daging Sapi Segar', quantity: 10, unit: 'kg', unitPrice: 120000, total: 1200000 },
        { materialId: 'mat003', materialName: 'Ayam Potong', quantity: 8, unit: 'kg', unitPrice: 35000, total: 280000 },
        { materialId: 'mat006', materialName: 'Cabai Merah', quantity: 5, unit: 'kg', unitPrice: 45000, total: 225000 }
      ]
    },
    {
      id: 'po003',
      poNumber: 'PO-2025-003',
      supplier: 'UD Mitra Sejahtera',
      supplierContact: '021-11223344',
      orderDate: '2025-01-22',
      expectedDelivery: '2025-01-27',
      totalAmount: 665000,
      itemCount: 2,
      status: 'pending',
      subtotal: 599099,
      tax: 65901,
      notes: 'Pesanan minyak goreng dan tepung',
      items: [
        { materialId: 'mat007', materialName: 'Minyak Goreng', quantity: 20, unit: 'liter', unitPrice: 18000, total: 360000 },
        { materialId: 'mat010', materialName: 'Tepung Terigu', quantity: 15, unit: 'kg', unitPrice: 12000, total: 180000 }
      ]
    },
    {
      id: 'po004',
      poNumber: 'PO-2025-004',
      supplier: 'PT Bahan Pangan Nusantara',
      supplierContact: '021-55667788',
      orderDate: '2025-01-18',
      expectedDelivery: '2025-01-23',
      totalAmount: 1332000,
      itemCount: 4,
      status: 'delivered',
      subtotal: 1200000,
      tax: 132000,
      notes: 'Pesanan bahan kering bulanan',
      items: [
        { materialId: 'mat001', materialName: 'Beras Premium', quantity: 30, unit: 'kg', unitPrice: 15000, total: 450000 },
        { materialId: 'mat009', materialName: 'Gula Pasir', quantity: 25, unit: 'kg', unitPrice: 14000, total: 350000 },
        { materialId: 'mat010', materialName: 'Tepung Terigu', quantity: 20, unit: 'kg', unitPrice: 12000, total: 240000 },
        { materialId: 'mat008', materialName: 'Garam Dapur', quantity: 20, unit: 'kg', unitPrice: 5000, total: 100000 }
      ]
    }
  ]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setActiveTab('create-order');
  };

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${order.poNumber}?`)) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
    }
  };

  const handleSaveOrder = (orderData, action) => {
    if (editingOrder) {
      // Update existing order
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : order
      ));
      setEditingOrder(null);
    } else {
      // Create new order
      const newOrder = {
        ...orderData,
        id: `po${Date.now()}`,
        poNumber: `PO-2025-${String(orders.length + 1).padStart(3, '0')}`
      };
      setOrders(prev => [newOrder, ...prev]);
    }

    if (action === 'send') {
      alert('Pesanan berhasil dikirim ke pemasok!');
    } else if (action === 'draft') {
      alert('Pesanan berhasil disimpan sebagai draft!');
    } else if (action === 'print') {
      alert('Pesanan berhasil dicetak!');
    }

    setActiveTab('active-orders');
  };

  const handleCreateOrderFromSuggestions = (suggestions) => {
    // Group suggestions by supplier
    const groupedBySupplier = suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.supplier]) {
        acc[suggestion.supplier] = [];
      }
      acc[suggestion.supplier].push({
        materialId: suggestion.materialId,
        materialName: suggestion.materialName,
        quantity: suggestion.suggestedQuantity,
        unit: suggestion.unit,
        unitPrice: suggestion.lastPrice,
        total: suggestion.suggestedQuantity * suggestion.lastPrice
      });
      return acc;
    }, {});

    // Create orders for each supplier
    Object.entries(groupedBySupplier).forEach(([supplier, items]) => {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.11;
      const total = subtotal + tax;

      const newOrder = {
        id: `po${Date.now()}_${supplier.replace(/\s+/g, '')}`,
        poNumber: `PO-2025-${String(orders.length + Object.keys(groupedBySupplier).indexOf(supplier) + 1).padStart(3, '0')}`,
        supplier: supplier,
        supplierContact: '021-12345678', // Default contact
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalAmount: total,
        itemCount: items.length,
        status: 'pending',
        subtotal: subtotal,
        tax: tax,
        notes: 'Pesanan otomatis berdasarkan saran sistem',
        items: items
      };

      setOrders(prev => [newOrder, ...prev]);
    });

    alert(`${Object.keys(groupedBySupplier).length} pesanan berhasil dibuat dari saran sistem!`);
    setActiveTab('active-orders');
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <PrimarySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pesanan Pembelian</h1>
                <p className="text-muted-foreground mt-1">
                  Kelola pesanan pembelian dan hubungan dengan pemasok
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => {
                    setEditingOrder(null);
                    setActiveTab('create-order');
                  }}
                >
                  Buat Pesanan Baru
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingCart" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pesanan</p>
                  <p className="text-xl font-bold text-foreground">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-xl font-bold text-foreground">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selesai</p>
                  <p className="text-xl font-bold text-foreground">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Nilai</p>
                  <p className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('active-orders')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'active-orders' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name="List" size={16} />
                    <span>Pesanan Aktif</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setEditingOrder(null);
                    setActiveTab('create-order');
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'create-order' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name="Plus" size={16} />
                    <span>Buat Pesanan Baru</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('reorder-suggestions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'reorder-suggestions' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name="Lightbulb" size={16} />
                    <span>Saran Pemesanan</span>
                    <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs font-medium rounded-full">
                      5
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'active-orders' && (
              <OrdersTable
                orders={orders}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            )}

            {activeTab === 'create-order' && (
              <CreateOrderForm
                editOrder={editingOrder}
                onSave={handleSaveOrder}
                onCancel={() => {
                  setEditingOrder(null);
                  setActiveTab('active-orders');
                }}
              />
            )}

            {activeTab === 'reorder-suggestions' && (
              <ReorderSuggestions
                onCreateOrder={handleCreateOrderFromSuggestions}
              />
            )}
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default PurchaseOrders;