import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import POSHeader from './components/POSHeader';
import PaymentModal from './components/PaymentModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PointOfSaleInterface = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('makanan-utama');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Mock data for categories
  const categories = [
    {
      id: 'makanan-utama',
      name: 'Makanan Utama',
      icon: 'ChefHat',
      itemCount: 12
    },
    {
      id: 'minuman',
      name: 'Minuman',
      icon: 'Coffee',
      itemCount: 8
    },
    {
      id: 'dessert',
      name: 'Dessert',
      icon: 'IceCream',
      itemCount: 6
    },
    {
      id: 'appetizer',
      name: 'Appetizer',
      icon: 'Utensils',
      itemCount: 5
    },
    {
      id: 'snack',
      name: 'Snack',
      icon: 'Cookie',
      itemCount: 10
    }
  ];

  // Mock data for products
  const allProducts = [
    {
      id: 1,
      name: 'Nasi Gudeg Jogja',
      description: 'Nasi gudeg khas Jogja dengan ayam kampung dan telur',
      price: 25000,
      originalPrice: 30000,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      category: 'makanan-utama',
      available: true,
      stock: 15,
      isPopular: true,
      isNew: false
    },
    {
      id: 2,
      name: 'Ayam Bakar Taliwang',
      description: 'Ayam bakar bumbu taliwang pedas dengan plecing kangkung',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&h=200&fit=crop',
      category: 'makanan-utama',
      available: true,
      stock: 8,
      isPopular: false,
      isNew: true
    },
    {
      id: 3,
      name: 'Rendang Daging Sapi',
      description: 'Rendang daging sapi empuk dengan bumbu rempah tradisional',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=200&fit=crop',
      category: 'makanan-utama',
      available: true,
      stock: 12,
      isPopular: true,
      isNew: false
    },
    {
      id: 4,
      name: 'Soto Ayam Lamongan',
      description: 'Soto ayam kuah bening dengan telur dan kerupuk',
      price: 20000,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      category: 'makanan-utama',
      available: false,
      stock: 0,
      isPopular: false,
      isNew: false
    },
    {
      id: 5,
      name: 'Es Teh Manis',
      description: 'Es teh manis segar dengan gula aren',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
      category: 'minuman',
      available: true,
      stock: 25,
      isPopular: true,
      isNew: false
    },
    {
      id: 6,
      name: 'Jus Alpukat',
      description: 'Jus alpukat segar dengan susu kental manis',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=200&fit=crop',
      category: 'minuman',
      available: true,
      stock: 18,
      isPopular: false,
      isNew: true
    },
    {
      id: 7,
      name: 'Kopi Tubruk',
      description: 'Kopi tubruk tradisional dengan gula batu',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
      category: 'minuman',
      available: true,
      stock: 30,
      isPopular: true,
      isNew: false
    },
    {
      id: 8,
      name: 'Es Cendol',
      description: 'Es cendol dengan santan dan gula merah',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
      category: 'dessert',
      available: true,
      stock: 20,
      isPopular: true,
      isNew: false
    },
    {
      id: 9,
      name: 'Klepon',
      description: 'Klepon isi gula merah dengan kelapa parut',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      category: 'dessert',
      available: true,
      stock: 12,
      isPopular: false,
      isNew: true
    },
    {
      id: 10,
      name: 'Kerupuk Udang',
      description: 'Kerupuk udang renyah sebagai pelengkap',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
      category: 'appetizer',
      available: true,
      stock: 50,
      isPopular: false,
      isNew: false
    }
  ];

  // Filter products by category
  const filteredProducts = allProducts.filter(product => 
    product.category === selectedCategory
  );

  // Add item to cart
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, notes: '' }];
      }
    });
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Add note to item
  const handleAddNote = (itemId, note) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, notes: note } : item
      )
    );
  };

  // Process payment
  const handleProcessPayment = (paymentData) => {
    setOrderData(paymentData);
    setShowPaymentModal(true);
  };

  // Confirm payment
  const handleConfirmPayment = (paymentData) => {
    // Simulate order processing
    console.log('Payment confirmed:', paymentData);
    
    // Clear cart
    setCartItems([]);
    
    // Show success message
    alert(`Pembayaran berhasil!\nTotal: ${new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(paymentData.total)}\nMetode: ${paymentData.paymentMethod}\nID Transaksi: ${paymentData.transactionId}`);
    
    // Navigate to kitchen display or print receipt
    // navigate('/kitchen-display-system');
  };

  // Header actions
  const handleOpenDrawer = () => {
    console.log('Opening cash drawer...');
    alert('Laci kasir dibuka');
  };

  const handlePrintLastReceipt = () => {
    console.log('Printing last receipt...');
    alert('Mencetak ulang struk terakhir...');
  };

  const handleViewReports = () => {
    navigate('/dashboard');
  };

  // Mobile cart toggle
  const toggleMobileCart = () => {
    setIsMobileCartOpen(!isMobileCartOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* POS Header */}
      <POSHeader
        cashierName="Sari Dewi"
        onOpenDrawer={handleOpenDrawer}
        onPrintLastReceipt={handlePrintLastReceipt}
        onViewReports={handleViewReports}
      />

      {/* Main POS Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Category Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile Category Tabs */}
          <div className="lg:hidden bg-card border-b border-border p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0"
                >
                  <Icon name={category.icon} size={16} className="mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Shopping Cart - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <ShoppingCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onAddNote={handleAddNote}
            onProcessPayment={handleProcessPayment}
          />
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="lg"
          onClick={toggleMobileCart}
          className="rounded-full shadow-elevation-3 relative"
        >
          <Icon name="ShoppingCart" size={24} className="mr-2" />
          Keranjang
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Cart Slide-out */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-[999] bg-background/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Keranjang Belanja</h2>
              <Button variant="ghost" size="icon" onClick={toggleMobileCart}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)]">
              <ShoppingCart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onAddNote={handleAddNote}
                onProcessPayment={(data) => {
                  handleProcessPayment(data);
                  setIsMobileCartOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderData={orderData}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default PointOfSaleInterface;