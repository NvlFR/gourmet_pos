import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderCard = ({ order, onStatusChange, onItemToggle }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const orderTime = new Date(order.createdAt);
      const elapsed = Math.floor((now - orderTime) / 60000); // minutes
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getTimeColor = () => {
    if (elapsedTime < 15) return 'text-success';
    if (elapsedTime < 30) return 'text-warning';
    return 'text-error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'ready': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-card text-card-foreground border-border';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'new': 'in-progress',
      'in-progress': 'ready',
      'ready': 'completed',
      'completed': 'completed'
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'Mulai Masak',
      'in-progress': 'Siap Disajikan',
      'ready': 'Selesai',
      'completed': 'Selesai'
    };
    return labels[status];
  };

  const completedItems = order.items.filter(item => item.completed).length;
  const totalItems = order.items.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className={`bg-card border-2 rounded-lg p-4 shadow-elevation-2 transition-all duration-200 hover:shadow-elevation-3 ${getStatusColor(order.status)}`}>
      {/* Order Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
            <span className="text-sm font-bold text-primary-foreground">
              {order.orderNumber}
            </span>
          </div>
          <div>
            <p className="font-semibold text-card-foreground">
              {order.tableNumber ? `Meja ${order.tableNumber}` : order.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.orderType === 'dine-in' ? 'Makan di Tempat' : 'Bungkus'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${getTimeColor()}`}>
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {order.status === 'in-progress' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{completedItems}/{totalItems}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center space-x-2 flex-1">
              {order.status === 'in-progress' && (
                <button
                  onClick={() => onItemToggle(order.id, index)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed 
                      ? 'bg-success border-success' :'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {item.completed && (
                    <Icon name="Check" size={12} className="text-white" />
                  )}
                </button>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                  {item.name}
                </p>
                {item.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    Catatan: {item.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm font-semibold ${item.completed ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                x{item.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="mb-4 p-2 bg-warning/10 border border-warning/20 rounded">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={14} className="text-warning mt-0.5" />
            <div>
              <p className="text-xs font-medium text-warning">Instruksi Khusus:</p>
              <p className="text-xs text-card-foreground">{order.specialInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Priority Badge */}
      {order.priority === 'high' && (
        <div className="mb-3 flex items-center space-x-1">
          <Icon name="Zap" size={14} className="text-error" />
          <span className="text-xs font-medium text-error">PRIORITAS TINGGI</span>
        </div>
      )}

      {/* Action Button */}
      {order.status !== 'completed' && (
        <Button
          variant={order.status === 'ready' ? 'success' : 'default'}
          size="sm"
          fullWidth
          onClick={() => onStatusChange(order.id, getNextStatus(order.status))}
          iconName={order.status === 'ready' ? 'CheckCircle' : 'ArrowRight'}
          iconPosition="right"
        >
          {getStatusLabel(order.status)}
        </Button>
      )}

      {/* Completed Badge */}
      {order.status === 'completed' && (
        <div className="flex items-center justify-center space-x-2 py-2 bg-success/10 rounded">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm font-medium text-success">Pesanan Selesai</span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;