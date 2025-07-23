import React, { useState, useMemo, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import InventoryTable from './components/InventoryTable';
import InventoryFilters from './components/InventoryFilters';
import InventorySummary from './components/InventorySummary';
import ItemDetailModal from './components/ItemDetailModal';

const InventoryManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    status: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: ''
  });

  // Mock inventory data
  const inventoryItems = [
    {
      id: 1,
      name: 'Daging Sapi Premium',
      category: 'Daging',
      currentStock: 45.5,
      unit: 'kg',
      supplier: 'PT Protein Prima',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'adequate',
      unitPrice: 120000,
      value: 5460000,
      minStock: 20,
      maxStock: 100
    },
    {
      id: 2,
      name: 'Tomat Segar',
      category: 'Sayuran',
      currentStock: 8.2,
      unit: 'kg',
      supplier: 'Toko Sayur Berkah',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      status: 'low',
      unitPrice: 15000,
      value: 123000,
      minStock: 15,
      maxStock: 50
    },
    {
      id: 3,
      name: 'Bawang Merah',
      category: 'Sayuran',
      currentStock: 3.1,
      unit: 'kg',
      supplier: 'CV Bahan Makanan Jaya',
      lastUpdated: new Date(Date.now() - 45 * 60 * 1000),
      status: 'critical',
      unitPrice: 25000,
      value: 77500,
      minStock: 10,
      maxStock: 30
    },
    {
      id: 4,
      name: 'Beras Premium',
      category: 'Biji-bijian',
      currentStock: 125.0,
      unit: 'kg',
      supplier: 'PT Segar Nusantara',
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'adequate',
      unitPrice: 12000,
      value: 1500000,
      minStock: 50,
      maxStock: 200
    },
    {
      id: 5,
      name: 'Keju Mozzarella',
      category: 'Produk Susu',
      currentStock: 12.5,
      unit: 'kg',
      supplier: 'UD Rempah Nusantara',
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'low',
      unitPrice: 85000,
      value: 1062500,
      minStock: 15,
      maxStock: 40
    },
    {
      id: 6,
      name: 'Ikan Salmon',
      category: 'Makanan Laut',
      currentStock: 18.3,
      unit: 'kg',
      supplier: 'PT Protein Prima',
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'adequate',
      unitPrice: 180000,
      value: 3294000,
      minStock: 10,
      maxStock: 30
    },
    {
      id: 7,
      name: 'Cabai Merah',
      category: 'Sayuran',
      currentStock: 2.8,
      unit: 'kg',
      supplier: 'Toko Sayur Berkah',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'critical',
      unitPrice: 35000,
      value: 98000,
      minStock: 8,
      maxStock: 25
    },
    {
      id: 8,
      name: 'Ayam Kampung',
      category: 'Daging',
      currentStock: 32.0,
      unit: 'kg',
      supplier: 'CV Bahan Makanan Jaya',
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'adequate',
      unitPrice: 45000,
      value: 1440000,
      minStock: 20,
      maxStock: 60
    }
  ];

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           item.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || item.category.toLowerCase().includes(filters.category.toLowerCase());
      const matchesSupplier = !filters.supplier || item.supplier === filters.supplier;
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesMinValue = !filters.minValue || item.value >= parseFloat(filters.minValue);
      const matchesMaxValue = !filters.maxValue || item.value <= parseFloat(filters.maxValue);
      
      let matchesDateRange = true;
      if (filters.startDate && filters.endDate) {
        const itemDate = new Date(item.lastUpdated);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }

      return matchesSearch && matchesCategory && matchesSupplier && 
             matchesStatus && matchesMinValue && matchesMaxValue && matchesDateRange;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [filters, sortConfig]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(item => item.status === 'low').length;
    const criticalStockItems = inventoryItems.filter(item => item.status === 'critical').length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);

    return {
      totalItems,
      lowStockItems,
      criticalStockItems,
      totalValue
    };
  }, []);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: '',
      status: '',
      startDate: '',
      endDate: '',
      minValue: '',
      maxValue: ''
    });
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleItemSave = (updatedItem) => {
    // In a real app, this would update the backend
    console.log('Saving item:', updatedItem);
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      alert('Pilih item terlebih dahulu');
      return;
    }

    switch (action) {
      case 'export':
        console.log('Exporting items:', selectedItems);
        break;
      case 'update-prices': console.log('Updating prices for items:', selectedItems);
        break;
      case 'adjust-stock': console.log('Adjusting stock for items:', selectedItems);
        break;
      case 'generate-po': console.log('Generating PO for items:', selectedItems);
        break;
      case 'delete':
        if (confirm('Yakin ingin menghapus item yang dipilih?')) {
          console.log('Deleting items:', selectedItems);
          setSelectedItems([]);
        }
        break;
      default:
        break;
    }
  };

  const handleAddItem = () => {
    console.log('Adding new item');
  };

  const handleGeneratePO = () => {
    console.log('Generating purchase order');
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch fresh data from the API
      console.log('Auto-refreshing inventory data...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <PrimarySidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <BreadcrumbNavigation />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Manajemen Inventori</h1>
            <p className="text-muted-foreground">
              Kelola stok bahan baku dan pantau pergerakan inventori secara real-time
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <InventoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onBulkAction={handleBulkAction}
              />

              <InventoryTable
                items={filteredAndSortedItems}
                onItemClick={handleItemClick}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>

            {/* Sidebar Summary */}
            <div className="xl:col-span-1">
              <InventorySummary
                summaryData={summaryData}
                onAddItem={handleAddItem}
                onGeneratePO={handleGeneratePO}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleItemSave}
      />
    </div>
  );
};

export default InventoryManagement;