import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RecipeList = ({ recipes, selectedRecipe, onSelectRecipe, onDeleteRecipe, onDuplicateRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.menuItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ing => ing.material.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.menuItem.localeCompare(b.menuItem);
      case 'cost':
        return a.totalCost - b.totalCost;
      case 'ingredients':
        return a.ingredients.length - b.ingredients.length;
      case 'margin':
        return b.profitMargin - a.profitMargin;
      default:
        return 0;
    }
  });

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Daftar Resep</h2>
          <span className="text-sm text-muted-foreground">
            {sortedRecipes.length} resep
          </span>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Cari resep atau bahan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-input border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="name">Nama Menu</option>
            <option value="cost">Biaya Bahan</option>
            <option value="ingredients">Jumlah Bahan</option>
            <option value="margin">Margin Keuntungan</option>
          </select>
        </div>
      </div>

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto">
        {sortedRecipes.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="BookOpen" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">
              {searchTerm ? 'Tidak ada resep yang ditemukan' : 'Belum ada resep'}
            </p>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
              >
                Hapus filter
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {sortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
                  selectedRecipe?.id === recipe.id
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/30'
                }`}
                onClick={() => onSelectRecipe(recipe)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {recipe.menuItem}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {recipe.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateRecipe(recipe);
                      }}
                      className="w-6 h-6"
                    >
                      <Icon name="Copy" size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecipe(recipe.id);
                      }}
                      className="w-6 h-6 text-muted-foreground hover:text-error"
                    >
                      <Icon name="Trash2" size={12} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Bahan:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {recipe.ingredients.length} item
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Biaya:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {formatCurrency(recipe.totalCost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Harga Jual:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {formatCurrency(recipe.sellingPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Margin:</span>
                    <span className={`ml-1 font-medium ${getProfitMarginColor(recipe.profitMargin)}`}>
                      {recipe.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {recipe.lastModified && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Diubah: {new Date(recipe.lastModified).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;