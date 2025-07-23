import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RecipeEditor = ({ 
  recipe, 
  menuItems, 
  rawMaterials, 
  onSave, 
  onTestRecipe, 
  onCostAnalysis,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    id: null,
    menuItemId: '',
    menuItem: '',
    category: '',
    description: '',
    servingSize: 1,
    ingredients: [
      {
        id: Date.now(),
        materialId: '',
        material: '',
        quantity: '',
        purchaseUnit: '',
        usageUnit: '',
        conversionFactor: 1,
        unitCost: 0,
        totalCost: 0
      }
    ],
    instructions: '',
    prepTime: '',
    cookTime: '',
    difficulty: 'mudah',
    totalCost: 0,
    sellingPrice: 0,
    profitMargin: 0,
    suggestedPrice: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recipe) {
      setFormData({
        ...recipe,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [
          {
            id: Date.now(),
            materialId: '',
            material: '',
            quantity: '',
            purchaseUnit: '',
            usageUnit: '',
            conversionFactor: 1,
            unitCost: 0,
            totalCost: 0
          }
        ]
      });
    } else {
      resetForm();
    }
  }, [recipe]);

  useEffect(() => {
    calculateTotalCost();
  }, [formData.ingredients, formData.servingSize]);

  const resetForm = () => {
    setFormData({
      id: null,
      menuItemId: '',
      menuItem: '',
      category: '',
      description: '',
      servingSize: 1,
      ingredients: [
        {
          id: Date.now(),
          materialId: '',
          material: '',
          quantity: '',
          purchaseUnit: '',
          usageUnit: '',
          conversionFactor: 1,
          unitCost: 0,
          totalCost: 0
        }
      ],
      instructions: '',
      prepTime: '',
      cookTime: '',
      difficulty: 'mudah',
      totalCost: 0,
      sellingPrice: 0,
      profitMargin: 0,
      suggestedPrice: 0
    });
    setErrors({});
  };

  const menuItemOptions = menuItems.map(item => ({
    value: item.id,
    label: item.name,
    description: item.category
  }));

  const rawMaterialOptions = rawMaterials.map(material => ({
    value: material.id,
    label: material.name,
    description: `${material.category} - ${material.purchaseUnit}`
  }));

  const difficultyOptions = [
    { value: 'mudah', label: 'Mudah' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'sulit', label: 'Sulit' }
  ];

  const handleMenuItemChange = (value) => {
    const selectedItem = menuItems.find(item => item.id === value);
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        menuItemId: value,
        menuItem: selectedItem.name,
        category: selectedItem.category,
        sellingPrice: selectedItem.price || 0
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };

    if (field === 'materialId') {
      const selectedMaterial = rawMaterials.find(material => material.id === value);
      if (selectedMaterial) {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          material: selectedMaterial.name,
          purchaseUnit: selectedMaterial.purchaseUnit,
          usageUnit: selectedMaterial.usageUnit || selectedMaterial.purchaseUnit,
          conversionFactor: selectedMaterial.conversionFactor || 1,
          unitCost: selectedMaterial.unitCost || 0
        };
      }
    }

    if (field === 'quantity' || field === 'unitCost' || field === 'conversionFactor') {
      const quantity = parseFloat(updatedIngredients[index].quantity) || 0;
      const unitCost = parseFloat(updatedIngredients[index].unitCost) || 0;
      const conversionFactor = parseFloat(updatedIngredients[index].conversionFactor) || 1;
      updatedIngredients[index].totalCost = (quantity * unitCost) / conversionFactor;
    }

    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: Date.now(),
          materialId: '',
          material: '',
          quantity: '',
          purchaseUnit: '',
          usageUnit: '',
          conversionFactor: 1,
          unitCost: 0,
          totalCost: 0
        }
      ]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotalCost = () => {
    const totalCost = formData.ingredients.reduce((sum, ingredient) => {
      return sum + (parseFloat(ingredient.totalCost) || 0);
    }, 0);

    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const profitMargin = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0;
    const suggestedPrice = totalCost * 2.5; // 150% markup

    setFormData(prev => ({
      ...prev,
      totalCost,
      profitMargin,
      suggestedPrice
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.menuItemId) {
      newErrors.menuItem = 'Menu item harus dipilih';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi resep harus diisi';
    }

    if (formData.servingSize <= 0) {
      newErrors.servingSize = 'Porsi harus lebih dari 0';
    }

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.materialId) {
        newErrors[`ingredient_${index}_material`] = 'Bahan harus dipilih';
      }
      if (!ingredient.quantity || parseFloat(ingredient.quantity) <= 0) {
        newErrors[`ingredient_${index}_quantity`] = 'Jumlah harus lebih dari 0';
      }
    });

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instruksi pembuatan harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        lastModified: new Date().toISOString()
      });
      if (!recipe) {
        resetForm();
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProfitMarginColor = (margin) => {
    if (margin >= 60) return 'text-success';
    if (margin >= 40) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {recipe ? 'Edit Resep' : 'Resep Baru'}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              iconName="RotateCcw"
            >
              Reset
            </Button>
            {recipe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTestRecipe(formData)}
                iconName="Play"
              >
                Test Resep
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Informasi Dasar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Menu Item"
              placeholder="Pilih menu item"
              options={menuItemOptions}
              value={formData.menuItemId}
              onChange={handleMenuItemChange}
              error={errors.menuItem}
              required
              searchable
            />
            
            <Input
              label="Porsi"
              type="number"
              placeholder="1"
              value={formData.servingSize}
              onChange={(e) => setFormData(prev => ({ ...prev, servingSize: parseInt(e.target.value) || 1 }))}
              error={errors.servingSize}
              min="1"
              required
            />
          </div>

          <Input
            label="Deskripsi Resep"
            placeholder="Deskripsi singkat tentang resep ini"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={errors.description}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Waktu Persiapan (menit)"
              type="number"
              placeholder="15"
              value={formData.prepTime}
              onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
              min="0"
            />
            
            <Input
              label="Waktu Memasak (menit)"
              type="number"
              placeholder="30"
              value={formData.cookTime}
              onChange={(e) => setFormData(prev => ({ ...prev, cookTime: e.target.value }))}
              min="0"
            />
            
            <Select
              label="Tingkat Kesulitan"
              options={difficultyOptions}
              value={formData.difficulty}
              onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Bahan-Bahan
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addIngredient}
              iconName="Plus"
            >
              Tambah Bahan
            </Button>
          </div>

          <div className="space-y-3">
            {formData.ingredients.map((ingredient, index) => (
              <div key={ingredient.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-4">
                    <Select
                      label="Bahan"
                      placeholder="Pilih bahan"
                      options={rawMaterialOptions}
                      value={ingredient.materialId}
                      onChange={(value) => handleIngredientChange(index, 'materialId', value)}
                      error={errors[`ingredient_${index}_material`]}
                      required
                      searchable
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Jumlah"
                      type="number"
                      placeholder="0"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      error={errors[`ingredient_${index}_quantity`]}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Satuan"
                      value={ingredient.usageUnit}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Biaya per Unit"
                      value={formatCurrency(ingredient.unitCost)}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Input
                      label="Total"
                      value={formatCurrency(ingredient.totalCost)}
                      disabled
                      className="bg-muted font-medium"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={formData.ingredients.length === 1}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Instruksi Pembuatan
          </h3>
          
          <textarea
            className="w-full h-32 p-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tulis langkah-langkah pembuatan secara detail..."
            value={formData.instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          />
          {errors.instructions && (
            <p className="text-sm text-error">{errors.instructions}</p>
          )}
        </div>

        {/* Cost Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Analisis Biaya
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCostAnalysis(formData)}
              iconName="Calculator"
            >
              Detail Analisis
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Total Biaya Bahan</div>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(formData.totalCost)}
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Harga Jual Saat Ini</div>
              <div className="text-lg font-semibold text-foreground">
                <Input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                  className="text-lg font-semibold border-0 bg-transparent p-0 h-auto"
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Margin Keuntungan</div>
              <div className={`text-lg font-semibold ${getProfitMarginColor(formData.profitMargin)}`}>
                {formData.profitMargin.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground mb-1">Harga Disarankan</div>
              <div className="text-lg font-semibold text-primary">
                {formatCurrency(formData.suggestedPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {recipe && recipe.lastModified && (
              <span>Terakhir diubah: {new Date(recipe.lastModified).toLocaleString('id-ID')}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              iconName="Save"
            >
              {recipe ? 'Perbarui Resep' : 'Simpan Resep'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditor;