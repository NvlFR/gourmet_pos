import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShoppingCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onAddNote, onProcessPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerMoney, setCustomerMoney] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.11; // PPN 11%
  const tax = subtotal * taxRate;
  const serviceCharge = subtotal * 0.05; // Service charge 5%
  const total = subtotal + tax + serviceCharge;

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', icon: 'Banknote' },
    { id: 'card', name: 'Kartu Kredit/Debit', icon: 'CreditCard' },
    { id: 'qris', name: 'QRIS', icon: 'QrCode' },
    { id: 'gopay', name: 'GoPay', icon: 'Smartphone' },
    { id: 'ovo', name: 'OVO', icon: 'Wallet' }
  ];

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleProcessPayment = () => {
    if (cartItems.length === 0) return;
    
    const paymentData = {
      items: cartItems,
      subtotal,
      tax,
      serviceCharge,
      total,
      paymentMethod,
      customerMoney: paymentMethod === 'cash' ? parseFloat(customerMoney) || 0 : total,
      timestamp: new Date().toISOString()
    };
    
    onProcessPayment(paymentData);
    setShowPaymentModal(false);
    setCustomerMoney('');
  };

  const change = paymentMethod === 'cash' && customerMoney ? 
    Math.max(0, parseFloat(customerMoney) - total) : 0;

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Keranjang Belanja</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {cartItems.length} item
            </span>
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => cartItems.forEach(item => onRemoveItem(item.id))}
                className="w-6 h-6 text-error hover:bg-error/10"
              >
                <Icon name="Trash2" size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Keranjang Kosong</h3>
            <p className="text-muted-foreground text-sm">Pilih produk dari menu untuk memulai pesanan</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-background rounded-lg p-3 border border-border">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-primary font-semibold text-sm">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-6 h-6"
                        >
                          <Icon name="Minus" size={12} />
                        </Button>
                        <span className="text-sm font-medium text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-6 h-6"
                        >
                          <Icon name="Plus" size={12} />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="w-6 h-6 text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                        <Icon name="MessageSquare" size={12} className="inline mr-1" />
                        {item.notes}
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const note = prompt('Tambah catatan untuk item ini:', item.notes || '');
                        if (note !== null) {
                          onAddNote(item.id, note);
                        }
                      }}
                      className="mt-1 text-xs h-6 px-2"
                    >
                      <Icon name="Edit3" size={10} className="mr-1" />
                      {item.notes ? 'Edit Catatan' : 'Tambah Catatan'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PPN (11%)</span>
              <span className="text-foreground">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Charge (5%)</span>
              <span className="text-foreground">{formatPrice(serviceCharge)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentMethod(method.id)}
                  className="justify-start"
                >
                  <Icon name={method.icon} size={14} className="mr-2" />
                  <span className="text-xs">{method.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Cash Payment Input */}
          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <Input
                type="number"
                label="Uang Pelanggan"
                placeholder="Masukkan jumlah uang"
                value={customerMoney}
                onChange={(e) => setCustomerMoney(e.target.value)}
              />
              {customerMoney && (
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kembalian</span>
                    <span className={`font-medium ${change >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatPrice(change)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Process Payment Button */}
          <Button
            variant="success"
            fullWidth
            onClick={handleProcessPayment}
            disabled={paymentMethod === 'cash' && (!customerMoney || parseFloat(customerMoney) < total)}
            iconName="CreditCard"
            iconPosition="left"
            className="h-12 text-base font-semibold"
          >
            Proses Pembayaran
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;