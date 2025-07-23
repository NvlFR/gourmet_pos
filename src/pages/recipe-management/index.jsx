import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import RecipeList from './components/RecipeList';
import RecipeEditor from './components/RecipeEditor';
import CostAnalysisModal from './components/CostAnalysisModal';
import TestRecipeModal from './components/TestRecipeModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const RecipeManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [costAnalysisOpen, setCostAnalysisOpen] = useState(false);
  const [testRecipeOpen, setTestRecipeOpen] = useState(false);
  const [analysisRecipe, setAnalysisRecipe] = useState(null);
  const [testRecipe, setTestRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // split, list, editor

  // Mock data for menu items
  const [menuItems] = useState([
    {
      id: 'menu-001',
      name: 'Nasi Gudeg Jogja',
      category: 'Makanan Utama',
      price: 25000,
      description: 'Nasi gudeg khas Jogja dengan ayam dan telur'
    },
    {
      id: 'menu-002',
      name: 'Soto Ayam Lamongan',
      category: 'Makanan Utama',
      price: 18000,
      description: 'Soto ayam dengan kuah bening dan pelengkap'
    },
    {
      id: 'menu-003',
      name: 'Gado-Gado Jakarta',
      category: 'Makanan Utama',
      price: 15000,
      description: 'Gado-gado dengan bumbu kacang khas Jakarta'
    },
    {
      id: 'menu-004',
      name: 'Es Teh Manis',
      category: 'Minuman',
      price: 5000,
      description: 'Es teh manis segar'
    },
    {
      id: 'menu-005',
      name: 'Jus Alpukat',
      category: 'Minuman',
      price: 12000,
      description: 'Jus alpukat segar dengan susu'
    }
  ]);

  // Mock data for raw materials
  const [rawMaterials] = useState([
    {
      id: 'raw-001',
      name: 'Beras Premium',
      category: 'Bahan Pokok',
      purchaseUnit: 'kg',
      usageUnit: 'gram',
      conversionFactor: 1000,
      unitCost: 12000,
      stock: 50,
      minStock: 10
    },
    {
      id: 'raw-002',
      name: 'Ayam Kampung',
      category: 'Protein',
      purchaseUnit: 'kg',
      usageUnit: 'gram',
      conversionFactor: 1000,
      unitCost: 35000,
      stock: 25,
      minStock: 5
    },
    {
      id: 'raw-003',
      name: 'Nangka Muda',
      category: 'Sayuran',
      purchaseUnit: 'kg',
      usageUnit: 'gram',
      conversionFactor: 1000,
      unitCost: 8000,
      stock: 15,
      minStock: 3
    },
    {
      id: 'raw-004',
      name: 'Santan Kelapa',
      category: 'Bumbu',
      purchaseUnit: 'liter',
      usageUnit: 'ml',
      conversionFactor: 1000,
      unitCost: 15000,
      stock: 10,
      minStock: 2
    },
    {
      id: 'raw-005',
      name: 'Gula Merah',
      category: 'Bumbu',
      purchaseUnit: 'kg',
      usageUnit: 'gram',
      conversionFactor: 1000,
      unitCost: 18000,
      stock: 8,
      minStock: 2
    },
    {
      id: 'raw-006',
      name: 'Daun Salam',
      category: 'Rempah',
      purchaseUnit: 'ikat',
      usageUnit: 'lembar',
      conversionFactor: 20,
      unitCost: 3000,
      stock: 12,
      minStock: 3
    },
    {
      id: 'raw-007',
      name: 'Teh Celup',
      category: 'Minuman',
      purchaseUnit: 'box',
      usageUnit: 'sachet',
      conversionFactor: 25,
      unitCost: 8000,
      stock: 20,
      minStock: 5
    },
    {
      id: 'raw-008',
      name: 'Gula Pasir',
      category: 'Bumbu',
      purchaseUnit: 'kg',
      usageUnit: 'gram',
      conversionFactor: 1000,
      unitCost: 14000,
      stock: 30,
      minStock: 5
    }
  ]);

  // Mock data for recipes
  const [recipes, setRecipes] = useState([
    {
      id: 'recipe-001',
      menuItemId: 'menu-001',
      menuItem: 'Nasi Gudeg Jogja',
      category: 'Makanan Utama',
      description: 'Resep gudeg khas Jogja dengan cita rasa autentik',
      servingSize: 1,
      ingredients: [
        {
          id: 'ing-001',
          materialId: 'raw-001',
          material: 'Beras Premium',
          quantity: 150,
          purchaseUnit: 'kg',
          usageUnit: 'gram',
          conversionFactor: 1000,
          unitCost: 12000,
          totalCost: 1800
        },
        {
          id: 'ing-002',
          materialId: 'raw-002',
          material: 'Ayam Kampung',
          quantity: 100,
          purchaseUnit: 'kg',
          usageUnit: 'gram',
          conversionFactor: 1000,
          unitCost: 35000,
          totalCost: 3500
        },
        {
          id: 'ing-003',
          materialId: 'raw-003',
          material: 'Nangka Muda',
          quantity: 200,
          purchaseUnit: 'kg',
          usageUnit: 'gram',
          conversionFactor: 1000,
          unitCost: 8000,
          totalCost: 1600
        },
        {
          id: 'ing-004',
          materialId: 'raw-004',
          material: 'Santan Kelapa',
          quantity: 100,
          purchaseUnit: 'liter',
          usageUnit: 'ml',
          conversionFactor: 1000,
          unitCost: 15000,
          totalCost: 1500
        },
        {
          id: 'ing-005',
          materialId: 'raw-005',
          material: 'Gula Merah',
          quantity: 50,
          purchaseUnit: 'kg',
          usageUnit: 'gram',
          conversionFactor: 1000,
          unitCost: 18000,
          totalCost: 900
        }
      ],
      instructions: `1. Cuci beras hingga bersih, masak menjadi nasi putih\n2. Potong ayam menjadi bagian-bagian kecil\n3. Rebus nangka muda hingga empuk\n4. Tumis bumbu halus hingga harum\n5. Masukkan ayam, masak hingga berubah warna\n6. Tambahkan nangka muda dan santan\n7. Masak dengan api kecil selama 2 jam\n8. Tambahkan gula merah, aduk rata\n9. Sajikan dengan nasi putih`,
      prepTime: 30,
      cookTime: 150,
      difficulty: 'sedang',
      totalCost: 9300,
      sellingPrice: 25000,
      profitMargin: 62.8,
      suggestedPrice: 23250,
      lastModified: '2025-01-20T10:30:00Z'
    },
    {
      id: 'recipe-002',
      menuItemId: 'menu-004',
      menuItem: 'Es Teh Manis',
      category: 'Minuman',
      description: 'Es teh manis segar untuk menemani makanan',
      servingSize: 1,
      ingredients: [
        {
          id: 'ing-006',
          materialId: 'raw-007',
          material: 'Teh Celup',
          quantity: 1,
          purchaseUnit: 'box',
          usageUnit: 'sachet',
          conversionFactor: 25,
          unitCost: 8000,
          totalCost: 320
        },
        {
          id: 'ing-007',
          materialId: 'raw-008',
          material: 'Gula Pasir',
          quantity: 20,
          purchaseUnit: 'kg',
          usageUnit: 'gram',
          conversionFactor: 1000,
          unitCost: 14000,
          totalCost: 280
        }
      ],
      instructions: `1. Seduh teh celup dengan air panas 200ml\n2. Diamkan selama 3-5 menit\n3. Angkat teh celup, tambahkan gula pasir\n4. Aduk hingga gula larut\n5. Tambahkan es batu secukupnya\n6. Sajikan dalam gelas tinggi`,
      prepTime: 5,
      cookTime: 0,
      difficulty: 'mudah',
      totalCost: 600,
      sellingPrice: 5000,
      profitMargin: 88,
      suggestedPrice: 1500,
      lastModified: '2025-01-22T14:15:00Z'
    }
  ]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    if (window.innerWidth < 1024) {
      setViewMode('editor');
    }
  };

  const handleSaveRecipe = (recipeData) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (recipeData.id) {
        // Update existing recipe
        setRecipes(prev => prev.map(recipe => 
          recipe.id === recipeData.id ? recipeData : recipe
        ));
      } else {
        // Create new recipe
        const newRecipe = {
          ...recipeData,
          id: `recipe-${Date.now()}`,
          lastModified: new Date().toISOString()
        };
        setRecipes(prev => [newRecipe, ...prev]);
        setSelectedRecipe(newRecipe);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(null);
      }
    }
  };

  const handleDuplicateRecipe = (recipe) => {
    const duplicatedRecipe = {
      ...recipe,
      id: `recipe-${Date.now()}`,
      menuItem: `${recipe.menuItem} (Copy)`,
      lastModified: new Date().toISOString()
    };
    setRecipes(prev => [duplicatedRecipe, ...prev]);
    setSelectedRecipe(duplicatedRecipe);
  };

  const handleCostAnalysis = (recipe) => {
    setAnalysisRecipe(recipe);
    setCostAnalysisOpen(true);
  };

  const handleTestRecipe = (recipe) => {
    setTestRecipe(recipe);
    setTestRecipeOpen(true);
  };

  const handleSubmitTest = (testResult) => {
    console.log('Test result submitted:', testResult);
    // In a real app, this would be sent to the backend
  };

  const handleNewRecipe = () => {
    setSelectedRecipe(null);
    if (window.innerWidth < 1024) {
      setViewMode('editor');
    }
  };

  // Handle responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode('split');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Manajemen Resep - Gourmet POS</title>
        <meta name="description" content="Kelola resep dan bill of materials untuk menu restoran Anda" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader 
          onSidebarToggle={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
        />
        
        <PrimarySidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="lg:ml-64 pt-16">
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <BreadcrumbNavigation />
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Manajemen Resep
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Kelola resep dan bill of materials untuk menu restoran
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Mobile View Toggle */}
                  <div className="lg:hidden flex items-center space-x-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      iconName="List"
                    />
                    <Button
                      variant={viewMode === 'editor' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('editor')}
                      iconName="Edit"
                    />
                  </div>
                  
                  <Button
                    variant="default"
                    onClick={handleNewRecipe}
                    iconName="Plus"
                  >
                    Resep Baru
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
              {/* Recipe List - 5 columns */}
              <div className="lg:col-span-5">
                <RecipeList
                  recipes={recipes}
                  selectedRecipe={selectedRecipe}
                  onSelectRecipe={handleSelectRecipe}
                  onDeleteRecipe={handleDeleteRecipe}
                  onDuplicateRecipe={handleDuplicateRecipe}
                />
              </div>

              {/* Recipe Editor - 7 columns */}
              <div className="lg:col-span-7">
                <RecipeEditor
                  recipe={selectedRecipe}
                  menuItems={menuItems}
                  rawMaterials={rawMaterials}
                  onSave={handleSaveRecipe}
                  onTestRecipe={handleTestRecipe}
                  onCostAnalysis={handleCostAnalysis}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden">
              {viewMode === 'list' && (
                <div className="h-[calc(100vh-12rem)]">
                  <RecipeList
                    recipes={recipes}
                    selectedRecipe={selectedRecipe}
                    onSelectRecipe={handleSelectRecipe}
                    onDeleteRecipe={handleDeleteRecipe}
                    onDuplicateRecipe={handleDuplicateRecipe}
                  />
                </div>
              )}

              {viewMode === 'editor' && (
                <div className="h-[calc(100vh-12rem)]">
                  <RecipeEditor
                    recipe={selectedRecipe}
                    menuItems={menuItems}
                    rawMaterials={rawMaterials}
                    onSave={handleSaveRecipe}
                    onTestRecipe={handleTestRecipe}
                    onCostAnalysis={handleCostAnalysis}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="BookOpen" size={20} className="text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Resep</div>
                    <div className="text-xl font-semibold text-foreground">
                      {recipes.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  <div>
                    <div className="text-sm text-muted-foreground">Rata-rata Margin</div>
                    <div className="text-xl font-semibold text-foreground">
                      {recipes.length > 0 
                        ? (recipes.reduce((sum, recipe) => sum + recipe.profitMargin, 0) / recipes.length).toFixed(1)
                        : 0
                      }%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Package" size={20} className="text-warning" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bahan Tersedia</div>
                    <div className="text-xl font-semibold text-foreground">
                      {rawMaterials.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={20} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Terakhir Diubah</div>
                    <div className="text-sm font-medium text-foreground">
                      {recipes.length > 0 
                        ? new Date(Math.max(...recipes.map(r => new Date(r.lastModified)))).toLocaleDateString('id-ID')
                        : 'Belum ada'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <CostAnalysisModal
          isOpen={costAnalysisOpen}
          onClose={() => setCostAnalysisOpen(false)}
          recipe={analysisRecipe}
        />

        <TestRecipeModal
          isOpen={testRecipeOpen}
          onClose={() => setTestRecipeOpen(false)}
          recipe={testRecipe}
          onSubmitTest={handleSubmitTest}
        />
      </div>
    </>
  );
};

export default RecipeManagement;