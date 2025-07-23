import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'BarChart3' },
    '/point-of-sale-interface': { label: 'Point of Sale', icon: 'CreditCard' },
    '/kitchen-display-system': { label: 'Kitchen Display', icon: 'ChefHat' },
    '/inventory-management': { label: 'Inventory Management', icon: 'Boxes', parent: 'Inventory' },
    '/recipe-management': { label: 'Recipe Management', icon: 'BookOpen', parent: 'Inventory' },
    '/purchase-orders': { label: 'Purchase Orders', icon: 'ShoppingCart', parent: 'Inventory' }
  };

  const currentRoute = routeMap[location.pathname];
  
  if (!currentRoute) return null;

  const breadcrumbs = [];
  
  // Add home/dashboard
  if (location.pathname !== '/dashboard') {
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3'
    });
  }

  // Add parent if exists
  if (currentRoute.parent) {
    breadcrumbs.push({
      label: currentRoute.parent,
      path: null,
      icon: 'Package'
    });
  }

  // Add current page
  breadcrumbs.push({
    label: currentRoute.label,
    path: location.pathname,
    icon: currentRoute.icon,
    current: true
  });

  const handleBreadcrumbClick = (path) => {
    if (path && path !== location.pathname) {
      navigate(path);
    }
  };

  const handleGoBack = () => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      if (previousBreadcrumb.path) {
        navigate(previousBreadcrumb.path);
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="flex items-center space-x-2 py-3 text-sm" aria-label="Breadcrumb">
      {/* Back Button */}
      {breadcrumbs.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="mr-2 px-2"
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back
        </Button>
      )}

      {/* Breadcrumb Items */}
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            <div className="flex items-center space-x-1.5">
              <Icon 
                name={breadcrumb.icon} 
                size={14} 
                className={breadcrumb.current ? 'text-foreground' : 'text-muted-foreground'} 
              />
              
              {breadcrumb.current ? (
                <span className="font-medium text-foreground">
                  {breadcrumb.label}
                </span>
              ) : (
                <button
                  onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                  className={`
                    font-medium transition-colors duration-200
                    ${breadcrumb.path 
                      ? 'text-muted-foreground hover:text-foreground cursor-pointer' 
                      : 'text-muted-foreground cursor-default'
                    }
                  `}
                  disabled={!breadcrumb.path}
                >
                  {breadcrumb.label}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Page Actions */}
      <div className="flex-1 flex justify-end">
        {location.pathname === '/inventory-management' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="default" size="sm" iconName="Plus">
              Add Item
            </Button>
          </div>
        )}
        
        {location.pathname === '/recipe-management' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Import">
              Import Recipes
            </Button>
            <Button variant="default" size="sm" iconName="Plus">
              New Recipe
            </Button>
          </div>
        )}
        
        {location.pathname === '/purchase-orders' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="FileText">
              Generate Report
            </Button>
            <Button variant="default" size="sm" iconName="Plus">
              Create Order
            </Button>
          </div>
        )}

        {location.pathname === '/point-of-sale-interface' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Printer">
              Print Receipt
            </Button>
            <Button variant="success" size="sm" iconName="CreditCard">
              Process Payment
            </Button>
          </div>
        )}

        {location.pathname === '/kitchen-display-system' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh Orders
            </Button>
            <Button variant="warning" size="sm" iconName="Clock">
              Mark Ready
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation;