import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KitchenStatus = () => {
  const kitchenStats = {
    activeOrders: 12,
    avgPrepTime: 18,
    completedToday: 156,
    pendingOrders: 8
  };

  const activeOrders = [
    {
      id: 'ORD-006',
      table: 'Meja 7',
      items: ['Nasi Gudeg', 'Ayam Bakar'],
      prepTime: 15,
      elapsed: 8,
      priority: 'normal',
      status: 'preparing'
    },
    {
      id: 'ORD-007',
      table: 'Meja 15',
      items: ['Soto Ayam', 'Kerupuk', 'Es Teh'],
      prepTime: 12,
      elapsed: 12,
      priority: 'high',
      status: 'preparing'
    },
    {
      id: 'ORD-008',
      table: 'Takeaway',
      items: ['Gado-gado'],
      prepTime: 8,
      elapsed: 3,
      priority: 'normal',
      status: 'preparing'
    },
    {
      id: 'ORD-009',
      table: 'Meja 4',
      items: ['Nasi Gudeg', 'Es Jeruk'],
      prepTime: 10,
      elapsed: 10,
      priority: 'urgent',
      status: 'ready'
    }
  ];

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'urgent':
        return { color: 'text-error', bgColor: 'bg-error/10', label: 'Urgent' };
      case 'high':
        return { color: 'text-warning', bgColor: 'bg-warning/10', label: 'Tinggi' };
      default:
        return { color: 'text-primary', bgColor: 'bg-primary/10', label: 'Normal' };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'preparing':
        return { color: 'text-warning', icon: 'ChefHat', label: 'Dimasak' };
      case 'ready':
        return { color: 'text-success', icon: 'CheckCircle', label: 'Siap' };
      default:
        return { color: 'text-muted-foreground', icon: 'Clock', label: 'Menunggu' };
    }
  };

  const getTimeProgress = (elapsed, prepTime) => {
    const percentage = (elapsed / prepTime) * 100;
    return Math.min(percentage, 100);
  };

  const isOverdue = (elapsed, prepTime) => elapsed > prepTime;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Status Dapur</h3>
            <p className="text-sm text-muted-foreground">Aktivitas dapur real-time</p>
          </div>
          <Button variant="outline" size="sm" iconName="Monitor">
            Tampilan Dapur
          </Button>
        </div>
      </div>

      {/* Kitchen Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">{kitchenStats.activeOrders}</span>
            </div>
            <p className="text-xs text-muted-foreground">Pesanan Aktif</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Icon name="Timer" size={16} className="text-success" />
              <span className="text-2xl font-bold text-foreground">{kitchenStats.avgPrepTime}m</span>
            </div>
            <p className="text-xs text-muted-foreground">Rata-rata Waktu</p>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">Pesanan Aktif</h4>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>

        {activeOrders.map((order) => {
          const priorityConfig = getPriorityConfig(order.priority);
          const statusConfig = getStatusConfig(order.status);
          const timeProgress = getTimeProgress(order.elapsed, order.prepTime);
          const overdue = isOverdue(order.elapsed, order.prepTime);

          return (
            <div
              key={order.id}
              className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-elevation-1 ${
                overdue ? 'bg-error/5 border-error/20' : 'bg-muted/20 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground text-sm">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color} ${priorityConfig.bgColor}`}>
                    {priorityConfig.label}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name={statusConfig.icon} size={14} className={statusConfig.color} />
                  <span className={`text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{order.table}</span>
                  <span className={`font-medium ${overdue ? 'text-error' : 'text-foreground'}`}>
                    {order.elapsed}m / {order.prepTime}m
                  </span>
                </div>

                <div className="text-xs text-foreground">
                  {order.items.join(', ')}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      overdue ? 'bg-error' : timeProgress > 75 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${timeProgress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={14} className="text-success" />
              <span className="text-muted-foreground">Selesai hari ini:</span>
              <span className="font-medium text-foreground">{kitchenStats.completedToday}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="text-muted-foreground">Menunggu:</span>
            <span className="font-medium text-foreground">{kitchenStats.pendingOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenStatus;