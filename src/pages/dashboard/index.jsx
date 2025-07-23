import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import TopItemsChart from './components/TopItemsChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import LowStockAlert from './components/LowStockAlert';
import KitchenStatus from './components/KitchenStatus';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock real-time data - in production this would come from WebSocket or API
  const dashboardMetrics = {
    dailySales: {
      value: 'Rp 4.580.000',
      change: '+12.5%',
      changeType: 'increase'
    },
    orderCount: {
      value: '156',
      change: '+8.2%',
      changeType: 'increase'
    },
    averageOrder: {
      value: 'Rp 29.359',
      change: '+3.1%',
      changeType: 'increase'
    },
    profitMargin: {
      value: '68.5%',
      change: '-2.1%',
      changeType: 'decrease'
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new-order': navigate('/point-of-sale-interface');
        break;
      case 'kitchen-display': navigate('/kitchen-display-system');
        break;
      case 'inventory': navigate('/inventory-management');
        break;
      case 'reports':
        // Navigate to reports page when available
        console.log('Navigate to reports');
        break;
      default:
        break;
    }
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        onSidebarToggle={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <PrimarySidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <BreadcrumbNavigation />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  {formatDateTime(currentTime)}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="BarChart3"
                  onClick={() => handleQuickAction('reports')}
                >
                  Lihat Laporan
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  onClick={() => handleQuickAction('new-order')}
                >
                  Pesanan Baru
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Penjualan Hari Ini"
              value={dashboardMetrics.dailySales.value}
              change={dashboardMetrics.dailySales.change}
              changeType={dashboardMetrics.dailySales.changeType}
              icon="DollarSign"
              color="success"
            />
            <MetricCard
              title="Jumlah Pesanan"
              value={dashboardMetrics.orderCount.value}
              change={dashboardMetrics.orderCount.change}
              changeType={dashboardMetrics.orderCount.changeType}
              icon="ShoppingBag"
              color="primary"
            />
            <MetricCard
              title="Rata-rata Pesanan"
              value={dashboardMetrics.averageOrder.value}
              change={dashboardMetrics.averageOrder.change}
              changeType={dashboardMetrics.averageOrder.changeType}
              icon="TrendingUp"
              color="warning"
            />
            <MetricCard
              title="Margin Keuntungan"
              value={dashboardMetrics.profitMargin.value}
              change={dashboardMetrics.profitMargin.change}
              changeType={dashboardMetrics.profitMargin.changeType}
              icon="Percent"
              color="error"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <div className="lg:col-span-1">
              <TopItemsChart />
            </div>
          </div>

          {/* Data Tables and Status Row */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Recent Orders - Takes 6 columns on xl screens */}
            <div className="xl:col-span-6">
              <RecentOrdersTable />
            </div>
            
            {/* Right Side Panels - Each takes 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <LowStockAlert />
            </div>
            
            <div className="xl:col-span-3">
              <KitchenStatus />
            </div>
          </div>

          {/* Quick Access Actions */}
          <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-elevation-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Akses Cepat</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('new-order')}
              >
                <Icon name="CreditCard" size={24} />
                <span className="text-sm">POS</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('kitchen-display')}
              >
                <Icon name="ChefHat" size={24} />
                <span className="text-sm">Dapur</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('inventory')}
              >
                <Icon name="Package" size={24} />
                <span className="text-sm">Inventori</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('reports')}
              >
                <Icon name="FileText" size={24} />
                <span className="text-sm">Laporan</span>
              </Button>
            </div>
          </div>

          {/* System Status Footer */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">Sistem Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={14} className="text-success" />
                  <span className="text-muted-foreground">Koneksi Stabil</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                Terakhir disinkronkan: {currentTime.toLocaleTimeString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;