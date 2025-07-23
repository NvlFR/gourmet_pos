import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalHeader = ({ onSidebarToggle, sidebarOpen = false }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Tomatoes running low (5 units remaining)',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Order Completed',
      message: 'Table 12 order has been served',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'error',
      title: 'Payment Failed',
      message: 'Credit card transaction declined for Order #1234',
      time: '10 minutes ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      case 'error': return 'XCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
    setUserMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Logo and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Gourmet POS</h1>
              <p className="text-xs text-muted-foreground">Restaurant Management</p>
            </div>
          </div>
        </div>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Real-time Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success font-medium">System Online</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 animate-scale-in z-[1001]">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon
                          name={getNotificationIcon(notification.type)}
                          size={16}
                          className={getNotificationColor(notification.type)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-popover-foreground truncate">
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleUserMenuClick}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Manager</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-3 animate-scale-in z-[1001]">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-popover-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">john.doe@restaurant.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Manager Role</p>
                </div>
                
                <div className="py-2">
                  <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted/50 transition-colors flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted/50 transition-colors flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted/50 transition-colors flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(notificationOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={() => {
            setNotificationOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default GlobalHeader;