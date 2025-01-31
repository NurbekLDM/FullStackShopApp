import React, {Suspense} from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
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

export default function App() {

  const routes= [
    { path:"/", element:<HomePage /> },
    { path:"/register", element:<RegisterPage /> },
    {path:"/login", element:<LoginPage /> },
    { path:"/product", element:<ProductDetails /> },
    { path:"/checkout", element:<CheckoutPage />},
    { path:"/payment", element:<Payment />},
    { path:"/orders", element:<OrdersPage />},
    { path:"/orderDetails", element:<OrderDetails />},
    { path:"/favourites", element:<Favourites />},
    {
      path: "adminPanel",
      element: <Dashboard />,
      children : [
        {path: "products", element: <ProductsPage />},
      ],
    }

  ]

  const router = createBrowserRouter(routes, {
    future: {
        v7_startTransition: true,
    }
  })
  return (
      <Suspense fallback={<div style={{color: 'white', textAlign: 'center', marginTop: '20%'}}>Loading...</div>}>
        <RouterProvider router={router}/>
      </Suspense>

  );
}




