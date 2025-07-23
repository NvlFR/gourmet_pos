import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentModal = ({ isOpen, onClose, orderData, onConfirmPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerMoney, setCustomerMoney] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const change = paymentMethod === 'cash' && customerMoney ? 
    Math.max(0, parseFloat(customerMoney) - orderData.total) : 0;

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', icon: 'Banknote', description: 'Pembayaran dengan uang tunai' },
    { id: 'card', name: 'Kartu Kredit/Debit', icon: 'CreditCard', description: 'Visa, Mastercard, dll' },
    { id: 'qris', name: 'QRIS', icon: 'QrCode', description: 'Scan QR Code untuk bayar' },
    { id: 'gopay', name: 'GoPay', icon: 'Smartphone', description: 'Pembayaran digital GoPay' },
    { id: 'ovo', name: 'OVO', icon: 'Wallet', description: 'Pembayaran digital OVO' }
  ];

  const handleConfirmPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentData = {
      ...orderData,
      paymentMethod,
      customerMoney: paymentMethod === 'cash' ? parseFloat(customerMoney) : orderData.total,
      change,
      cardNumber: paymentMethod === 'card' ? cardNumber : null,
      transactionId: `TXN${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    onConfirmPayment(paymentData);
    setProcessing(false);
    onClose();
    
    // Reset form
    setCustomerMoney('');
    setCardNumber('');
    setPaymentMethod('cash');
  };

  const canProcessPayment = () => {
    if (paymentMethod === 'cash') {
      return customerMoney && parseFloat(customerMoney) >= orderData.total;
    }
    if (paymentMethod === 'card') {
      return cardNumber && cardNumber.length >= 16;
    }
    return true; // For digital payments
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Proses Pembayaran</h2>
              <p className="text-muted-foreground">Pilih metode pembayaran dan konfirmasi transaksi</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({orderData.items.length} item)</span>
                <span className="text-foreground">{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PPN (11%)</span>
                <span className="text-foreground">{formatPrice(orderData.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Charge (5%)</span>
                <span className="text-foreground">{formatPrice(orderData.serviceCharge)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-foreground">Total Pembayaran</span>
                  <span className="text-primary">{formatPrice(orderData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${paymentMethod === method.id 
                      ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${paymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                    `}>
                      <Icon name={method.icon} size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        paymentMethod === method.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <Input
                type="number"
                label="Uang Pelanggan"
                placeholder="Masukkan jumlah uang yang diterima"
                value={customerMoney}
                onChange={(e) => setCustomerMoney(e.target.value)}
                required
              />
              {customerMoney && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Kembalian</span>
                    <span className={`text-lg font-semibold ${
                      change >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {formatPrice(change)}
                    </span>
                  </div>
                  {change < 0 && (
                    <p className="text-error text-sm mt-1">
                      Uang tidak mencukupi. Kurang {formatPrice(Math.abs(change))}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <Input
                type="text"
                label="Nomor Kartu"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                maxLength={19}
                required
              />
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Shield" size={16} />
                  <span>Transaksi kartu akan diproses melalui terminal EDC</span>
                </div>
              </div>
            </div>
          )}

          {(paymentMethod === 'qris' || paymentMethod === 'gopay' || paymentMethod === 'ovo') && (
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-background border-2 border-dashed border-border rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Icon name="QrCode" size={48} className="text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-2">Scan QR Code</p>
              <p className="text-sm text-muted-foreground">
                Minta pelanggan untuk scan QR code dengan aplikasi {paymentMethods.find(m => m.id === paymentMethod)?.name}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmPayment}
              disabled={!canProcessPayment() || processing}
              loading={processing}
              iconName="CreditCard"
              iconPosition="left"
              className="px-8"
            >
              {processing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;