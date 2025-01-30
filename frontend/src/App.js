import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register";
import './App.css';
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProductDetails from './components/productDetails';
import CheckoutPage from './pages/checkout';
import Payment from './pages/payment';
import OrdersPage from "./pages/orders";
import OrderDetails from "./pages/orderDetails";
import Favourites from "./pages/favourites";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path= "/login" element={<LoginPage />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orderDetails" element={<OrderDetails />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


