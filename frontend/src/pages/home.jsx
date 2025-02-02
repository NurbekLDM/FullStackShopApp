import React, {useState} from "react";
import Navbar from "../components/navbar";
import Products from "../components/products";
import Categories from "../components/categories";
import Footer from "../components/footer";
import Search from "../components/search";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    return (
        <div className="bg-gray-50">

        <Navbar />

        <Categories />

            <div className="md:absolute md:top-24 md:left-1/4 md:z-10 md:w-1/2 md:mx-auto md:mt-10">
                <Search onSearch={handleSearch} />
            </div>
        <div>
        <Products searchTerm={searchTerm} />
        </div>
 
    <Footer />


        </div>
    );
}