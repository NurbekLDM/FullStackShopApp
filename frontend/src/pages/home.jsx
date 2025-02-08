import React, { useState } from "react";
import Navbar from "../components/navbar";
import Products from "../components/products";
import Categories from "../components/categories";
import Footer from "../components/footer";
import Search from "../components/search";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (query) => {
        setSearchTerm(query); // Qidiruv so'rovini saqlash
    };

    return (
        <div className="bg-gray-50">
            <Navbar />
            <Categories />

            <div className=" sm:absolute sm:top-24 sm:left-1/4 sm:z-0 sm:w-1/2 sm:mx-auto sm:mt-10">
                <Search onSearch={handleSearch} />
            </div>

            <div>
                <Products searchTerm={searchTerm} />
            </div>

            <Footer />
        </div>
    );
}