import React from 'react';
import Icon from '../../../components/AppIcon';
import OrderCard from './OrderCard';

const StatusColumn = ({ 
  status, 
  title, 
  orders, 
  onStatusChange, 
  onItemToggle,
  color = 'primary' 
}) => {
  const getColumnIcon = (status) => {
    switch (status) {
      case 'new': return 'Clock';
      case 'in-progress': return 'ChefHat';
      case 'ready': return 'CheckCircle';
      case 'completed': return 'Archive';
      default: return 'Circle';
    }
  };

  const getColumnColor = (color) => {
    switch (color) {
      case 'primary': return 'border-primary/30 bg-primary/5';
      case 'warning': return 'border-warning/30 bg-warning/5';
      case 'success': return 'border-success/30 bg-success/5';
      case 'muted': return 'border-border bg-muted/20';
      default: return 'border-border bg-card';
    }
  };

  const getHeaderColor = (color) => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'muted': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className={`flex-1 min-h-0 border-2 rounded-lg ${getColumnColor(color)}`}>
      {/* Column Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getColumnIcon(status)} 
              size={20} 
              className={getHeaderColor(color)} 
            />
            <h3 className={`font-semibold text-lg ${getHeaderColor(color)}`}>
              {title}
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            orders.length > 0 
              ? `bg-${color} text-${color}-foreground` 
              : 'bg-muted text-muted-foreground'
          }`}>
            {orders.length}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Icon 
              name={getColumnIcon(status)} 
              size={48} 
              className="text-muted-foreground mx-auto mb-3 opacity-50" 
            />
            <p className="text-muted-foreground">
              {status === 'new' && 'Tidak ada pesanan baru'}
              {status === 'in-progress' && 'Tidak ada pesanan sedang diproses'}
              {status === 'ready' && 'Tidak ada pesanan siap disajikan'}
              {status === 'completed' && 'Tidak ada pesanan selesai'}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onItemToggle={onItemToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StatusColumn;