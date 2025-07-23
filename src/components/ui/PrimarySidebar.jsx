import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimarySidebar = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState({ inventory: true });
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      path: '/dashboard',
      description: 'Business analytics and overview'
    },
    {
      id: 'pos',
      label: 'Point of Sale',
      icon: 'CreditCard',
      path: '/point-of-sale-interface',
      description: 'Transaction processing interface'
    },
    {
      id: 'kitchen',
      label: 'Kitchen Display',
      icon: 'ChefHat',
      path: '/kitchen-display-system',
      description: 'Real-time order management'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: 'Package',
      description: 'Stock and supply management',
      submenu: [
        {
          id: 'inventory-management',
          label: 'Stock Management',
          icon: 'Boxes',
          path: '/inventory-management',
          description: 'Track and manage inventory levels'
        },
        {
          id: 'recipe-management',
          label: 'Recipe Management',
          icon: 'BookOpen',
          path: '/recipe-management',
          description: 'Create and manage recipes'
        },
        {
          id: 'purchase-orders',
          label: 'Purchase Orders',
          icon: 'ShoppingCart',
          path: '/purchase-orders',
          description: 'Manage supplier orders'
        }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isActiveParent = (submenu) => {
    return submenu?.some(item => location.pathname === item.path);
  };

  const renderMenuItem = (item, isSubmenuItem = false) => {
    const isActive = isActiveRoute(item.path);
    const hasSubmenu = item.submenu && !isSubmenuItem;
    const isParentActive = hasSubmenu && isActiveParent(item.submenu);

    return (
      <div key={item.id} className={isSubmenuItem ? 'ml-4' : ''}>
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.id);
            } else if (item.path) {
              handleNavigation(item.path);
            }
          }}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group
            ${isActive 
              ? 'bg-primary text-primary-foreground shadow-elevation-1' 
              : isParentActive
                ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
            ${isSubmenuItem ? 'text-sm py-2' : ''}
          `}
          title={item.description}
        >
          <div className="flex items-center space-x-3">
            <Icon 
              name={item.icon} 
              size={isSubmenuItem ? 16 : 18} 
              className={`
                transition-colors duration-200
                ${isActive 
                  ? 'text-primary-foreground' 
                  : isParentActive 
                    ? 'text-primary' :'text-muted-foreground group-hover:text-foreground'
                }
              `}
            />
            <span className={`font-medium ${isSubmenuItem ? 'text-sm' : ''}`}>
              {item.label}
            </span>
          </div>
          
          {hasSubmenu && (
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`
                transition-transform duration-200
                ${expandedMenus[item.id] ? 'rotate-180' : ''}
                ${isParentActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
              `}
            />
          )}
        </button>

        {/* Submenu */}
        {hasSubmenu && expandedMenus[item.id] && (
          <div className="mt-1 space-y-1 animate-accordion-down">
            {item.submenu.map(subItem => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[998] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border z-[999] transition-transform duration-300 ease-out-custom
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:fixed
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map(item => renderMenuItem(item))}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                onClick={() => handleNavigation('/point-of-sale-interface')}
              >
                New Order
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => handleNavigation('/dashboard')}
              >
                View Reports
              </Button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">All systems operational</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Last sync: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PrimarySidebar;