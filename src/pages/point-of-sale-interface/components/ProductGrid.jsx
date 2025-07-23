import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductGrid = ({ products, onAddToCart, searchTerm, onSearchChange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
    // Visual feedback
    setSelectedProduct(product.id);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Input
            type="search"
            placeholder="Cari menu atau produk..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`
                  bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all duration-200 cursor-pointer
                  ${selectedProduct === product.id ? 'ring-2 ring-primary scale-95' : ''}
                  ${!product.available ? 'opacity-50' : ''}
                `}
                onClick={() => product.available && handleAddToCart(product)}
              >
                {/* Product Image */}
                <div className="relative h-32 bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.available && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-sm font-medium text-error">Habis</span>
                    </div>
                  )}
                  {product.isPopular && (
                    <div className="absolute top-2 left-2 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
                      <Icon name="Star" size={12} className="inline mr-1" />
                      Populer
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-2 right-2 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Baru
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                    
                    {product.available ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        disabled
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                  </div>

                  {/* Stock indicator */}
                  {product.available && product.stock <= 5 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Icon name="AlertTriangle" size={12} className="text-warning" />
                      <span className="text-xs text-warning">Stok terbatas ({product.stock})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;