import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import PointOfSaleInterface from "pages/point-of-sale-interface";
import InventoryManagement from "pages/inventory-management";
import PurchaseOrders from "pages/purchase-orders";
import RecipeManagement from "pages/recipe-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/point-of-sale-interface" element={<PointOfSaleInterface />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/recipe-management" element={<RecipeManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;