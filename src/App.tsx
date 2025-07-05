// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Auth/Login';
import ProductList from './components/Products/ProductList';
import LocationList from './components/Locations/LocationList';
import InboundList from './components/Inbound/InboundList';
import OutboundList from './components/Outbound/OutboundList';
import StocktakingList from './components/Stocktaking/StocktakingList';
import StockReport from './components/Reports/StockReport';
import LowStockReport from './components/Reports/LowStockReport';
import UserList from './components/Users/UserList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Hàm gọi sau khi login thành công
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    // Khi chưa login thì chỉ hiện trang login
    return <Login onLogin={handleLogin} />;
  }

  // Khi đã login thì render các route chính
  return (
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/locations" element={<LocationList />} />
          <Route path="/inbounds" element={<InboundList />} />
          <Route path="/outbounds" element={<OutboundList />} />
          <Route path="/stocktakings" element={<StocktakingList />} />
          <Route path="/reports/stock" element={<StockReport />} />
          <Route path="/reports/low-stock" element={<LowStockReport />} />
          <Route path="/users" element={<UserList />} />
          {/* Đường dẫn không hợp lệ sẽ redirect về sản phẩm */}
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </MainLayout>
  );
}

export default App;
