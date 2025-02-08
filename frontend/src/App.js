import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import RegisterPage from "./pages/register";
import './App.css';
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProductDetails from './components/productDetails';
import CheckoutPage from './pages/checkout';
import Payment from './pages/payment';
import OrdersPage from "./pages/orders";
import OrderDetails from "./pages/orderDetails";
import Favourites from "./pages/favourites";
import Dashboard from "./pages/adminPanel/dashboard";
import ProductsPage from "./pages/adminPanel/components/products";
import AdminLoginPage from "./pages/adminPanel/login";

export default function App() {
  const token = localStorage.getItem("accessToken");
  const adminToken = localStorage.getItem("admin-token");

  const routes = [
    {
      path: "/",
      element: <HomePage />,
      index: true
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/product/:productId", element: <ProductDetails /> },
    {
      path: "/checkout",
      element: token ? <CheckoutPage /> : <Navigate to="/login" replace />
    },
    { path: "/payment", element: <Payment /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/orderDetails", element: <OrderDetails /> },
    { path: "/favourites", element: <Favourites /> },
    {
      path: "/adminPanel",
      element: adminToken ? <Dashboard /> : <Navigate to="/adminLogin" replace />,
      children: [
        { index: true, element: <Navigate to="products" replace /> },
        { path: "products", element: adminToken ? <ProductsPage /> : <Navigate to="/adminLogin" replace /> },
      ],
    },
    { path: "/adminLogin", element: <AdminLoginPage /> }
  ];

  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
    }
  });

  return (
      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
  );
}