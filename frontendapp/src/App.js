import React from 'react';
import "./App.css";
import Register from './Components/Register';
import Login from './Components/Login';
import { Navigate } from 'react-router-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateMobile from './Seller/CreateMobile';
import MobileList from './Buyer/MobilesList';
import SellerMobiles from './Seller/SellerMobiles';
import ErrorPage from './Components/ErrorPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Mobile Management */}
          <Route path="addmobile" element={<CreateMobile />} />
          <Route path="mobilelist" element={<MobileList />} />
          <Route path="sellerviewmobiles" element={<SellerMobiles />} />

          {/* Error & Default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
