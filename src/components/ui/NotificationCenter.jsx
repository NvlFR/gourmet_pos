import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ isOpen, onClose, onToggle }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      category: 'inventory',
      title: 'Low Stock Alert',
      message: 'Tomatoes running low (5 units remaining)',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      category: 'orders',
      title: 'Order Completed',
      message: 'Table 12 order has been served successfully',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unread: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'error',
      category: 'payment',
      title: 'Payment Failed',
      message: 'Credit card transaction declined for Order #1234',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      unread: false,
      priority: 'high'
    },
    {
      id: 4,
      type: 'info',
      category: 'system',
      title: 'System Update',
      message: 'POS system will be updated tonight at 2:00 AM',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'warning',
      category: 'inventory',
      title: 'Expiry Alert',
      message: 'Dairy products expiring in 2 days',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      unread: true,
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification every 30 seconds
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)],
          category: ['inventory', 'orders', 'system'][Math.floor(Math.random() * 3)],
          title: 'New Alert',
          message: 'This is a simulated real-time notification',
          timestamp: new Date(),
          unread: true,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20 notifications
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      case 'error': return 'XCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'inventory': return 'Package';
      case 'orders': return 'ShoppingBag';
      case 'payment': return 'CreditCard';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.category === filter;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'timestamp') return b.timestamp - a.timestamp;
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 w-96 bg-popover border border-border rounded-lg shadow-elevation-4 animate-scale-in z-[1001] max-h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={18} className="text-foreground" />
            <h3 className="font-semibold text-popover-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-input border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="inventory">Inventory</option>
            <option value="orders">Orders</option>
            <option value="payment">Payment</option>
            <option value="system">System</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-input border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="timestamp">Recent</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${
                notification.unread ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 relative">
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={16}
                    className={getNotificationColor(notification.type)}
                  />
                  <Icon
                    name={getCategoryIcon(notification.category)}
                    size={10}
                    className="absolute -bottom-1 -right-1 text-muted-foreground"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {notification.title}
                        </p>
                        {notification.priority === 'high' && (
                          <span className="px-1.5 py-0.5 bg-error/20 text-error text-xs font-medium rounded">
                            High
                          </span>
                        )}
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {notification.unread && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                          className="w-6 h-6"
                        >
                          <Icon name="Check" size={12} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="w-6 h-6 text-muted-foreground hover:text-error"
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth>
          View notification settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;