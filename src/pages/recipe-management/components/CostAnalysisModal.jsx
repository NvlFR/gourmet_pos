import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CostAnalysisModal = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateCostPerServing = () => {
    return recipe.totalCost / (recipe.servingSize || 1);
  };

  const calculateIngredientPercentage = (ingredientCost) => {
    return recipe.totalCost > 0 ? (ingredientCost / recipe.totalCost) * 100 : 0;
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (recipe.profitMargin < 40) {
      recommendations.push({
        type: 'warning',
        title: 'Margin Keuntungan Rendah',
        message: 'Pertimbangkan untuk menaikkan harga jual atau mencari bahan dengan harga lebih murah.',
        action: 'Tingkatkan harga jual menjadi ' + formatCurrency(recipe.totalCost * 2.5)
      });
    }

    if (recipe.profitMargin > 80) {
      recommendations.push({
        type: 'success',
        title: 'Margin Keuntungan Tinggi',
        message: 'Margin keuntungan sangat baik. Pertimbangkan untuk meningkatkan kualitas bahan.',
        action: 'Pertahankan strategi pricing saat ini'
      });
    }

    const expensiveIngredients = recipe.ingredients
      .filter(ing => calculateIngredientPercentage(ing.totalCost) > 30)
      .sort((a, b) => b.totalCost - a.totalCost);

    if (expensiveIngredients.length > 0) {
      recommendations.push({
        type: 'info',
        title: 'Bahan Berbiaya Tinggi',
        message: `${expensiveIngredients[0].material} menyumbang ${formatPercentage(calculateIngredientPercentage(expensiveIngredients[0].totalCost))} dari total biaya.`,
        action: 'Cari alternatif supplier atau bahan pengganti'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1002] flex items-center justify-center p-4">
      <div className="bg-popover border border-border rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-popover-foreground">
                Analisis Biaya Resep
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {recipe.menuItem} - {recipe.category}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Total Biaya</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(recipe.totalCost)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Per porsi: {formatCurrency(calculateCostPerServing())}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Harga Jual</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(recipe.sellingPrice)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Per porsi: {formatCurrency(recipe.sellingPrice / (recipe.servingSize || 1))}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Percent" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Margin</span>
              </div>
              <div className={`text-2xl font-bold ${
                recipe.profitMargin >= 60 ? 'text-success' : 
                recipe.profitMargin >= 40 ? 'text-warning' : 'text-error'
              }`}>
                {formatPercentage(recipe.profitMargin)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Keuntungan: {formatCurrency(recipe.sellingPrice - recipe.totalCost)}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Disarankan</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(recipe.suggestedPrice)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Margin 60%
              </div>
            </div>
          </div>

          {/* Ingredient Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Rincian Biaya Bahan
            </h3>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Bahan</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Jumlah</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Satuan</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Harga/Unit</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">Total</th>
                      <th className="text-right p-3 text-sm font-medium text-foreground">% dari Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients
                      .sort((a, b) => b.totalCost - a.totalCost)
                      .map((ingredient, index) => (
                      <tr key={ingredient.id} className="border-t border-border">
                        <td className="p-3 text-sm text-foreground font-medium">
                          {ingredient.material}
                        </td>
                        <td className="p-3 text-sm text-foreground text-right">
                          {parseFloat(ingredient.quantity).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground text-right">
                          {ingredient.usageUnit}
                        </td>
                        <td className="p-3 text-sm text-foreground text-right">
                          {formatCurrency(ingredient.unitCost)}
                        </td>
                        <td className="p-3 text-sm text-foreground text-right font-medium">
                          {formatCurrency(ingredient.totalCost)}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground text-right">
                          {formatPercentage(calculateIngredientPercentage(ingredient.totalCost))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30 border-t-2 border-border">
                    <tr>
                      <td colSpan="4" className="p-3 text-sm font-semibold text-foreground">
                        Total Biaya Bahan
                      </td>
                      <td className="p-3 text-sm font-bold text-foreground text-right">
                        {formatCurrency(recipe.totalCost)}
                      </td>
                      <td className="p-3 text-sm font-semibold text-foreground text-right">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Rekomendasi
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    rec.type === 'warning' ? 'bg-warning/10 border-warning/20' :
                    rec.type === 'success'? 'bg-success/10 border-success/20' : 'bg-primary/10 border-primary/20'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <Icon 
                        name={
                          rec.type === 'warning' ? 'AlertTriangle' :
                          rec.type === 'success' ? 'CheckCircle' : 'Info'
                        }
                        size={20}
                        className={
                          rec.type === 'warning' ? 'text-warning' :
                          rec.type === 'success'? 'text-success' : 'text-primary'
                        }
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.message}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          Tindakan: {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Comparison */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Perbandingan Harga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Harga Minimum</div>
                  <div className="text-xl font-bold text-error">
                    {formatCurrency(recipe.totalCost * 1.2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margin 20% (Break-even)
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Harga Optimal</div>
                  <div className="text-xl font-bold text-warning">
                    {formatCurrency(recipe.totalCost * 2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margin 50% (Standar industri)
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Harga Premium</div>
                  <div className="text-xl font-bold text-success">
                    {formatCurrency(recipe.totalCost * 3)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margin 67% (Premium)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Analisis dibuat pada: {new Date().toLocaleString('id-ID')}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
              <Button variant="default" iconName="Download">
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisModal;