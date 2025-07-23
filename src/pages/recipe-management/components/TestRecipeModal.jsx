import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TestRecipeModal = ({ isOpen, onClose, recipe, onSubmitTest }) => {
  const [testData, setTestData] = useState({
    testerName: '',
    testDate: new Date().toISOString().split('T')[0],
    portionsTested: 1,
    actualTime: {
      prep: '',
      cook: ''
    },
    ratings: {
      taste: 5,
      appearance: 5,
      texture: 5,
      aroma: 5,
      overall: 5
    },
    notes: '',
    issues: [],
    suggestions: '',
    wouldRecommend: true
  });

  const [currentIssue, setCurrentIssue] = useState('');

  if (!isOpen || !recipe) return null;

  const ratingLabels = {
    taste: 'Rasa',
    appearance: 'Penampilan',
    texture: 'Tekstur',
    aroma: 'Aroma',
    overall: 'Keseluruhan'
  };

  const commonIssues = [
    'Terlalu asin',
    'Kurang bumbu',
    'Terlalu matang',
    'Kurang matang',
    'Tekstur tidak sesuai',
    'Waktu memasak tidak akurat',
    'Bahan sulit didapat',
    'Instruksi tidak jelas'
  ];

  const handleRatingChange = (category, value) => {
    setTestData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: parseInt(value)
      }
    }));
  };

  const addIssue = (issue) => {
    if (issue && !testData.issues.includes(issue)) {
      setTestData(prev => ({
        ...prev,
        issues: [...prev.issues, issue]
      }));
      setCurrentIssue('');
    }
  };

  const removeIssue = (issueToRemove) => {
    setTestData(prev => ({
      ...prev,
      issues: prev.issues.filter(issue => issue !== issueToRemove)
    }));
  };

  const handleSubmit = () => {
    const testResult = {
      ...testData,
      recipeId: recipe.id,
      recipeName: recipe.menuItem,
      testId: Date.now(),
      submittedAt: new Date().toISOString()
    };
    
    onSubmitTest(testResult);
    onClose();
    
    // Reset form
    setTestData({
      testerName: '',
      testDate: new Date().toISOString().split('T')[0],
      portionsTested: 1,
      actualTime: {
        prep: '',
        cook: ''
      },
      ratings: {
        taste: 5,
        appearance: 5,
        texture: 5,
        aroma: 5,
        overall: 5
      },
      notes: '',
      issues: [],
      suggestions: '',
      wouldRecommend: true
    });
  };

  const averageRating = Object.values(testData.ratings).reduce((sum, rating) => sum + rating, 0) / 5;

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-error';
  };

  const StarRating = ({ value, onChange, category }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(category, star)}
            className={`text-xl transition-colors ${
              star <= value ? 'text-warning' : 'text-muted-foreground'
            } hover:text-warning`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value}/5
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1002] flex items-center justify-center p-4">
      <div className="bg-popover border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-popover-foreground">
                Test Resep
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Penguji"
              placeholder="Masukkan nama penguji"
              value={testData.testerName}
              onChange={(e) => setTestData(prev => ({ ...prev, testerName: e.target.value }))}
              required
            />
            
            <Input
              label="Tanggal Test"
              type="date"
              value={testData.testDate}
              onChange={(e) => setTestData(prev => ({ ...prev, testDate: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Jumlah Porsi yang Ditest"
              type="number"
              min="1"
              value={testData.portionsTested}
              onChange={(e) => setTestData(prev => ({ ...prev, portionsTested: parseInt(e.target.value) || 1 }))}
            />
            
            <Input
              label="Waktu Persiapan Aktual (menit)"
              type="number"
              placeholder={recipe.prepTime || "Tidak ditentukan"}
              value={testData.actualTime.prep}
              onChange={(e) => setTestData(prev => ({ 
                ...prev, 
                actualTime: { ...prev.actualTime, prep: e.target.value }
              }))}
            />
            
            <Input
              label="Waktu Memasak Aktual (menit)"
              type="number"
              placeholder={recipe.cookTime || "Tidak ditentukan"}
              value={testData.actualTime.cook}
              onChange={(e) => setTestData(prev => ({ 
                ...prev, 
                actualTime: { ...prev.actualTime, cook: e.target.value }
              }))}
            />
          </div>

          {/* Ratings */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Penilaian
            </h3>
            <div className="space-y-4">
              {Object.entries(ratingLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <StarRating
                    value={testData.ratings[key]}
                    onChange={handleRatingChange}
                    category={key}
                  />
                </div>
              ))}
              
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Rata-rata Penilaian
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getRatingColor(averageRating)}`}>
                      {averageRating.toFixed(1)}/5
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= Math.round(averageRating) ? 'text-warning' : 'text-muted-foreground'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Masalah yang Ditemukan
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Tambahkan masalah..."
                  value={currentIssue}
                  onChange={(e) => setCurrentIssue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addIssue(currentIssue);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addIssue(currentIssue)}
                  iconName="Plus"
                >
                  Tambah
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {commonIssues.map((issue) => (
                  <button
                    key={issue}
                    onClick={() => addIssue(issue)}
                    className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                  >
                    {issue}
                  </button>
                ))}
              </div>
              
              {testData.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Masalah yang Dicatat:</h4>
                  <div className="space-y-1">
                    {testData.issues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-error/10 rounded border border-error/20">
                        <span className="text-sm text-foreground">{issue}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIssue(issue)}
                          className="w-6 h-6 text-error hover:text-error"
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes and Suggestions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Catatan Tambahan
              </label>
              <textarea
                className="w-full h-24 p-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Catatan detail tentang proses dan hasil..."
                value={testData.notes}
                onChange={(e) => setTestData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Saran Perbaikan
              </label>
              <textarea
                className="w-full h-24 p-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Saran untuk memperbaiki resep..."
                value={testData.suggestions}
                onChange={(e) => setTestData(prev => ({ ...prev, suggestions: e.target.value }))}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="recommend"
                checked={testData.wouldRecommend}
                onChange={(e) => setTestData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
              />
              <label htmlFor="recommend" className="text-sm font-medium text-foreground">
                Saya merekomendasikan resep ini untuk digunakan
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Test akan disimpan dengan timestamp saat ini
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button 
                variant="default" 
                onClick={handleSubmit}
                iconName="Save"
                disabled={!testData.testerName.trim()}
              >
                Simpan Hasil Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRecipeModal;