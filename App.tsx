import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import StockMovements from './pages/StockMovements';
import AddStockMovement from './pages/AddStockMovement';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock-movements" element={<StockMovements />} />
          <Route path="/add-stock-movement" element={<AddStockMovement />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App; 