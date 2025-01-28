import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register";
import './App.css';
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProductDetails from './components/productDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path= "/login" element={<LoginPage />} />
        <Route path="/product" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


