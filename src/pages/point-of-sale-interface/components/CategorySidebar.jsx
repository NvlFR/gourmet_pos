import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Kategori Menu</h2>
        <p className="text-sm text-muted-foreground">Pilih kategori produk</p>
      </div>

      {/* Categories */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            fullWidth
            onClick={() => onCategorySelect(category.id)}
            className="justify-start h-16 text-left"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${selectedCategory === category.id 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted'
                }
              `}>
                <Icon 
                  name={category.icon} 
                  size={20} 
                  className={selectedCategory === category.id ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  selectedCategory === category.id ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {category.name}
                </p>
                <p className={`text-xs ${
                  selectedCategory === category.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {category.itemCount} item
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" size="sm" fullWidth iconName="Search">
          Cari Menu
        </Button>
        <Button variant="ghost" size="sm" fullWidth iconName="Star">
          Menu Favorit
        </Button>
      </div>
    </div>
  );
};

export default CategorySidebar;