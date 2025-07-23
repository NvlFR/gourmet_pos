import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateOrderForm = ({ onSave, onCancel, editOrder = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    supplier: '',
    supplierContact: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    notes: '',
    items: [{ materialId: '', materialName: '', quantity: '', unit: '', unitPrice: '', total: 0 }]
  });

  const suppliers = [
    { id: 'sup001', name: 'PT Sumber Makmur', contact: '021-12345678', email: 'order@sumbermakmur.co.id' },
    { id: 'sup002', name: 'CV Berkah Jaya', contact: '021-87654321', email: 'sales@berkahjaya.com' },
    { id: 'sup003', name: 'UD Mitra Sejahtera', contact: '021-11223344', email: 'info@mitrasejahtera.id' },
    { id: 'sup004', name: 'PT Bahan Pangan Nusantara', contact: '021-55667788', email: 'procurement@bpn.co.id' }
  ];

  const materials = [
    { id: 'mat001', name: 'Beras Premium', unit: 'kg', lastPrice: 15000 },
    { id: 'mat002', name: 'Daging Sapi Segar', unit: 'kg', lastPrice: 120000 },
    { id: 'mat003', name: 'Ayam Potong', unit: 'kg', lastPrice: 35000 },
    { id: 'mat004', name: 'Tomat Segar', unit: 'kg', lastPrice: 8000 },
    { id: 'mat005', name: 'Bawang Merah', unit: 'kg', lastPrice: 25000 },
    { id: 'mat006', name: 'Cabai Merah', unit: 'kg', lastPrice: 45000 },
    { id: 'mat007', name: 'Minyak Goreng', unit: 'liter', lastPrice: 18000 },
    { id: 'mat008', name: 'Garam Dapur', unit: 'kg', lastPrice: 5000 },
    { id: 'mat009', name: 'Gula Pasir', unit: 'kg', lastPrice: 14000 },
    { id: 'mat010', name: 'Tepung Terigu', unit: 'kg', lastPrice: 12000 }
  ];

  useEffect(() => {
    if (editOrder) {
      setOrderData({
        supplier: editOrder.supplier,
        supplierContact: editOrder.supplierContact,
        orderDate: editOrder.orderDate,
        expectedDelivery: editOrder.expectedDelivery,
        notes: editOrder.notes || '',
        items: editOrder.items || [{ materialId: '', materialName: '', quantity: '', unit: '', unitPrice: '', total: 0 }]
      });
    }
  }, [editOrder]);

  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setOrderData(prev => ({
      ...prev,
      supplier: supplier?.name || '',
      supplierContact: supplier?.contact || ''
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderData.items];
    newItems[index][field] = value;

    if (field === 'materialId') {
      const material = materials.find(m => m.id === value);
      if (material) {
        newItems[index].materialName = material.name;
        newItems[index].unit = material.unit;
        newItems[index].unitPrice = material.lastPrice;
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = quantity * unitPrice;
    }

    setOrderData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { materialId: '', materialName: '', quantity: '', unit: '', unitPrice: '', total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (orderData.items.length > 1) {
      setOrderData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subtotal * 0.11; // PPN 11%
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (action) => {
    const { subtotal, tax, total } = calculateTotals();
    const orderToSave = {
      ...orderData,
      subtotal,
      tax,
      totalAmount: total,
      status: action === 'draft' ? 'draft' : 'sent',
      poNumber: editOrder?.poNumber || `PO-${Date.now()}`,
      itemCount: orderData.items.length
    };
    onSave(orderToSave, action);
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Form Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {editOrder ? 'Edit Pesanan Pembelian' : 'Buat Pesanan Pembelian Baru'}
            </h3>
            <p className="text-muted-foreground mt-1">
              {editOrder ? 'Perbarui detail pesanan pembelian' : 'Lengkapi informasi pesanan pembelian'}
            </p>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps - Mobile */}
        <div className="mt-6 lg:hidden">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground text-center">
            {currentStep === 1 && 'Pilih Pemasok'}
            {currentStep === 2 && 'Tambah Item'}
            {currentStep === 3 && 'Review & Kirim'}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Supplier Information */}
            <div className={`${currentStep !== 1 ? 'hidden lg:block' : ''}`}>
              <h4 className="text-lg font-medium text-foreground mb-4">Informasi Pemasok</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pilih Pemasok *
                  </label>
                  <select
                    value={suppliers.find(s => s.name === orderData.supplier)?.id || ''}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    required
                  >
                    <option value="">Pilih pemasok...</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Kontak Pemasok"
                  type="text"
                  value={orderData.supplierContact}
                  onChange={(e) => setOrderData(prev => ({ ...prev, supplierContact: e.target.value }))}
                  placeholder="Nomor telepon pemasok"
                  disabled
                />

                <Input
                  label="Tanggal Pesanan *"
                  type="date"
                  value={orderData.orderDate}
                  onChange={(e) => setOrderData(prev => ({ ...prev, orderDate: e.target.value }))}
                  required
                />

                <Input
                  label="Tanggal Pengiriman Diharapkan *"
                  type="date"
                  value={orderData.expectedDelivery}
                  onChange={(e) => setOrderData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Catatan Pesanan
                </label>
                <textarea
                  value={orderData.notes}
                  onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Tambahkan catatan khusus untuk pesanan ini..."
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground resize-none"
                  rows={3}
                />
              </div>

              <div className="lg:hidden mt-6">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => setCurrentStep(2)}
                  disabled={!orderData.supplier || !orderData.expectedDelivery}
                >
                  Lanjut ke Item
                </Button>
              </div>
            </div>

            {/* Step 2: Order Items */}
            <div className={`${currentStep !== 2 ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-foreground">Item Pesanan</h4>
                <Button variant="outline" size="sm" onClick={addItem} iconName="Plus">
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Item #{index + 1}</span>
                      {orderData.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="w-6 h-6 text-error hover:text-error"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Bahan *
                        </label>
                        <select
                          value={item.materialId}
                          onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground"
                          required
                        >
                          <option value="">Pilih bahan...</option>
                          {materials.map(material => (
                            <option key={material.id} value={material.id}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Jumlah *"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />

                      <Input
                        label="Satuan"
                        type="text"
                        value={item.unit}
                        disabled
                        placeholder="Satuan"
                      />

                      <Input
                        label="Harga Satuan (IDR) *"
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Item:</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(item.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:hidden mt-6 flex space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setCurrentStep(1)}
                >
                  Kembali
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => setCurrentStep(3)}
                  disabled={orderData.items.some(item => !item.materialId || !item.quantity || !item.unitPrice)}
                >
                  Review Pesanan
                </Button>
              </div>
            </div>

            {/* Step 3: Review (Mobile Only) */}
            <div className={`lg:hidden ${currentStep !== 3 ? 'hidden' : ''}`}>
              <h4 className="text-lg font-medium text-foreground mb-4">Review Pesanan</h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">Pemasok</h5>
                  <p className="text-sm text-muted-foreground">{orderData.supplier}</p>
                  <p className="text-sm text-muted-foreground">{orderData.supplierContact}</p>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">Item Pesanan</h5>
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm text-foreground">{item.materialName}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setCurrentStep(2)}
                >
                  Kembali
                </Button>
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => handleSubmit('send')}
                >
                  Kirim Pesanan
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-muted/20 rounded-lg border border-border p-4">
                <h4 className="text-lg font-medium text-foreground mb-4">Ringkasan Pesanan</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PPN (11%):</span>
                    <span className="text-foreground">{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Total:</span>
                      <span className="font-bold text-foreground text-lg">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleSubmit('draft')}
                    disabled={orderData.items.some(item => !item.materialId)}
                  >
                    Simpan Draft
                  </Button>
                  <Button
                    variant="success"
                    fullWidth
                    onClick={() => handleSubmit('send')}
                    disabled={!orderData.supplier || orderData.items.some(item => !item.materialId || !item.quantity || !item.unitPrice)}
                  >
                    Kirim ke Pemasok
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => handleSubmit('print')}
                    iconName="Printer"
                  >
                    Cetak PO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderForm;