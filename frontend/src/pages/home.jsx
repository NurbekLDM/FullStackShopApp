import React from "react";
import Navbar from "../components/navbar";
import Products from "../components/products";
import Categories from "../components/categories";
import Footer from "../components/footer";

export default function HomePage() {
    return (
        <div>

        <Navbar />

        <Categories />
        <div>
        <Products />
        </div>
 
    <Footer />


        </div>
    );
}