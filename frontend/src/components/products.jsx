import React, { useEffect, useState ,useRef } from "react";
import {getAllProducts, searchProducts} from "../servers/product";
import { useNavigate } from "react-router-dom";

export default function Products({searchTerm}) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const results = await searchProducts(query); // searchProducts API ni chaqiramiz
      setProducts(results);
    } catch (err) {
      setError("Failed to fetch search results");
      console.error("Error searching products:", err);
    } finally {
      setLoading(false);
    }
  };
  const filterButtonRef = useRef(null);
  const filterModalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sortDropdownButtonRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFavourite = (product) => {
    const { id, name, price, image } = product;
    const productData = { id, name, price, image };
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    favourites.push(productData);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    console.log("Favourite added", productData);
  };

  const handleProduct = (productId) => {
    navigate(`/product/${productId}`);
  }

  // Handle filter button and modal
  useEffect(() => {
    const button = filterButtonRef.current;
    const modal = filterModalRef.current;
    const closeButton = closeButtonRef.current;

    if (button && modal && closeButton) {
      const handleFilterButtonClick = () => {
        modal.classList.remove("hidden");
      };
      const handleCloseButtonClick = () => {
        modal.classList.add("hidden");
      };

      button.addEventListener("click", handleFilterButtonClick);
      closeButton.addEventListener("click", handleCloseButtonClick);

      // Cleanup
      return () => {
        button.removeEventListener("click", handleFilterButtonClick);
        closeButton.removeEventListener("click", handleCloseButtonClick);
      };
    }
  }, []);

  // Handle sort dropdown button
  useEffect(() => {
    const button = sortDropdownButtonRef.current;

    if (button) {
      const handleSortButtonClick = () => {
        setIsSortOpen((prevState) => !prevState);
      };

      button.addEventListener("click", handleSortButtonClick);

      // Cleanup
      return () => {
        button.removeEventListener("click", handleSortButtonClick);
      };
    }
  }, []);

  // Fetch products
  useEffect(() => {
    if (searchTerm) {
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const results = await searchProducts(searchTerm); // searchProducts API ni chaqiramiz
          setProducts(results);
        } catch (err) {
          setError("Failed to fetch search results");
          console.error("Error searching products:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    } else {
      // Agar qidiruv boʻsh boʻlsa, barcha mahsulotlarni koʻrsatamiz
      const fetchAllProducts = async () => {
        setLoading(true);
        try {
          const products = await getAllProducts();
          setProducts(products);
        } catch (err) {
          setError("Failed to fetch products");
          console.error("Error fetching products:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAllProducts();
    }
  }, [searchTerm]); // searchTerm o'zgarganida useEffect qayta ishlaydi


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <p>{error}</p>;

  return (
      <div>
        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
              <div>
                <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                  Products
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                    ref={filterButtonRef}
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
                >
                  <svg
                      className="-ms-0.5 me-2 h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
                    />
                  </svg>
                  Filters
                  <svg
                      className="-me-0.5 ms-2 h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>
                <button
                    ref={sortDropdownButtonRef}
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
                >
                  <svg
                      className="-ms-0.5 me-2 h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"
                    />
                  </svg>
                  Sort
                  <svg
                      className="-me-0.5 ms-2 h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                    id="dropdownSort1"
                    className={`${
                        isSortOpen ? "" : "hidden"
                    } z-10 absolute mt-72 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700`}
                >
                  <ul
                      className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                      aria-labelledby="sortDropdownButton"
                  >
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        The most popular
                      </a>
                    </li>
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Newest
                      </a>
                    </li>
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Increasing price
                      </a>
                    </li>
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Decreasing price
                      </a>
                    </li>
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        No. reviews
                      </a>
                    </li>
                    <li>
                      <a
                          href="#"
                          className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Discount %
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          {/*Get products from API*/}

          <div className="sm:flex gap-10">
           {products.map((product) => (
                    <div className="rounded-lg lg:w-1/4 md:w-1/2 sm:w-1/4 border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="h-56 w-full">
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleProduct(product.id);
                        }}>
                          <img
                              name="image"
                              className="mx-auto h-full dark:hidden"
                              src={product.image_data}
                              alt=""
                          />
                        </a>
                      </div>
                      <div className="pt-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            {" "}
                            {product.tag_name}{" "}
                          </span>

                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              data-tooltip-target="tooltip-quick-look"
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              <span className="sr-only"> Quick look </span>
                              <svg
                                className="h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                />
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                            </button>
                            <div
                              id="tooltip-quick-look"
                              role="tooltip"
                              className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                              data-popper-placement="top"
                            >
                              Quick look
                              <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>

                            <button
                              type="button"
                              data-tooltip-target="tooltip-add-to-favorites"
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              <span className="sr-only"> Add to Favorites </span>
                              <svg
                                  onClick={handleFavourite}
                                className="h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                                />
                              </svg>
                            </button>
                            <div
                              id="tooltip-add-to-favorites"
                              role="tooltip"
                              className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                              data-popper-placement="top"
                            >
                              Add to favorites
                              <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                          </div>
                        </div>

                        <a
                          href="#"
                          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                        name="name"
                        >
                          {product.name}
                        </a>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>

                            <svg
                              className="h-4 w-4 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>

                            <svg
                              className="h-4 w-4 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>

                            <svg
                              className="h-4 w-4 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>

                            <svg
                              className="h-4 w-4 text-yellow-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                            </svg>
                          </div>

                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            5.0
                          </p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            (455)
                          </p>
                        </div>

                        <ul className="mt-2 flex items-center gap-4">
                          <li className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Fast Delivery
                            </p>
                          </li>

                          <li className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Best Price
                            </p>
                          </li>
                        </ul>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                            ${product.price}
                          </p>

                          <button
                            type="button"
                            className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <svg
                              className="-ms-2 me-2 h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                              />
                            </svg>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>

           ))}
          </div>

          <div className="w-full mt-10 text-center">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Show more
            </button>
          </div>

        </div>

        <form
          action="#"
          method="get"
          id="filterModal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full"
        >
          <div className="relative h-full w-full max-w-xl md:h-auto">
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="flex items-start justify-between rounded-t p-4 md:p-5">
                <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Filters
                </h3>
                <button
                  id="closeButton"
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="filterModal"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="px-4 md:px-5">
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                  <ul
                    className="-mb-px flex flex-wrap text-center text-sm font-medium"
                    id="myTab"
                    data-tabs-toggle="#myTabContent"
                    role="tablist"
                  >
                    <li className="mr-1" role="presentation">
                      <button
                        className="inline-block pb-2 pr-1"
                        id="brand-tab"
                        data-tabs-target="#brand"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                      >
                        Brand
                      </button>
                    </li>
                  </ul>
                </div>
                <div id="myTabContent">
                  <div
                    className="grid grid-cols-2 gap-4 md:grid-cols-3"
                    id="brand"
                    role="tabpanel"
                    aria-labelledby="brand-tab"
                  >
                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        A
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="apple"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="apple"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Apple (56){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="asus"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="asus"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Asus (97){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="acer"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="acer"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Acer (234){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="allview"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="allview"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Allview (45){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="atari"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="asus"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Atari (176){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="amd"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="amd"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          AMD (49){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="aruba"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="aruba"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Aruba (16){" "}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        B
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="beats"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="beats"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Beats (56){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="bose"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="bose"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Bose (97){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="benq"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="benq"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          BenQ (45){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="bosch"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="bosch"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Bosch (176){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="brother"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="brother"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Brother (176){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="biostar"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="biostar"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Biostar (49){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="braun"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="braun"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Braun (16){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="blaupunkt"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="blaupunkt"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Blaupunkt (45){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="benq2"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="benq2"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          BenQ (23){" "}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        C
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="canon"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="canon"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Canon (49){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="cisco"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="cisco"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Cisco (97){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="cowon"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="cowon"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Cowon (234){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="clevo"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="clevo"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Clevo (45){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="corsair"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="corsair"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Corsair (15){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="csl"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="csl"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Canon (49){" "}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        D
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="dell"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="dell"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Dell (56){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="dogfish"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="dogfish"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Dogfish (24){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="dyson"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="dyson"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Dyson (234){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="dobe"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="dobe"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Dobe (5){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="digitus"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="digitus"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Digitus (1){" "}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        E
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="emetec"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="emetec"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Emetec (56){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="extreme"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="extreme"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Extreme (10){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="elgato"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="elgato"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Elgato (234){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="emerson"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="emerson"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Emerson (45){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="emi"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="emi"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          EMI (176){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="fugoo"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="fugoo"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Fugoo (49){" "}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                        F
                      </h5>

                      <div className="flex items-center">
                        <input
                          id="fujitsu"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="fujitsu"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Fujitsu (97){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="fitbit"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="fitbit"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Fitbit (56){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="foxconn"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="foxconn"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Foxconn (234){" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="floston"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          form="floston"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Floston (45){" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 space-y-4"
                  id="advanced-filters"
                  role="tabpanel"
                  aria-labelledby="advanced-filters-tab"
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          form="min-price"
                          className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Min Price{" "}
                        </label>
                      </div>

                      <div>
                        <label
                          form="max-price"
                          className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Max Price{" "}
                        </label>
                      </div>

                      <div className="col-span-2 flex items-center justify-between space-x-2">
                        <input
                          type="number"
                          id="min-price-input"
                          value="300"
                          min="0"
                          max="7000"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 "
                          placeholder=""
                          required
                        />

                        <div className="shrink-0 text-sm font-medium dark:text-gray-300">
                          to
                        </div>

                        <input
                          type="number"
                          id="max-price-input"
                          value="3500"
                          min="0"
                          max="7000"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label
                          form="min-delivery-time"
                          className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Min Delivery Time (Days){" "}
                        </label>
                      </div>

                      <input
                        type="number"
                        id="min-delivery-time-input"
                        value="30"
                        min="3"
                        max="50"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 "
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                        Colour
                      </h6>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="blue"
                            type="checkbox"
                            value=""
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />

                          <label
                            form="blue"
                            className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            <div className="mr-2 h-3.5 w-3.5 rounded-full bg-primary-600"></div>
                            Blue
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="gray"
                            type="checkbox"
                            value=""
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />

                          <label
                            form="gray"
                            className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            <div className="mr-2 h-3.5 w-3.5 rounded-full bg-gray-400"></div>
                            Gray
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="green"
                            type="checkbox"
                            value=""
                            checked
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />

                          <label
                            form="green"
                            className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            <div className="mr-2 h-3.5 w-3.5 rounded-full bg-green-400"></div>
                            Green
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="pink"
                            type="checkbox"
                            value=""
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />

                          <label
                            form="pink"
                            className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            <div className="mr-2 h-3.5 w-3.5 rounded-full bg-pink-400"></div>
                            Pink
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="red"
                            type="checkbox"
                            value=""
                            checked
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />

                          <label
                            form="red"
                            className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            <div className="mr-2 h-3.5 w-3.5 rounded-full bg-red-500"></div>
                            Red
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                        Rating
                      </h6>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="five-stars"
                            type="radio"
                            value=""
                            name="rating"
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            form="five-stars"
                            className="ml-2 flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>First star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Second star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Third star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fourth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fifth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="four-stars"
                            type="radio"
                            value=""
                            name="rating"
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            form="four-stars"
                            className="ml-2 flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>First star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Second star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Third star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fourth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fifth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="three-stars"
                            type="radio"
                            value=""
                            name="rating"
                            checked
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            form="three-stars"
                            className="ml-2 flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>First star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Second star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Third star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fourth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fifth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="two-stars"
                            type="radio"
                            value=""
                            name="rating"
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            form="two-stars"
                            className="ml-2 flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>First star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Second star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Third star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fourth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fifth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="one-star"
                            type="radio"
                            value=""
                            name="rating"
                            className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            form="one-star"
                            className="ml-2 flex items-center"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>First star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Second star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Third star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fourth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-300 dark:text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Fifth star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Delivery type
                    </h6>

                    <ul className="grid grid-cols-2 gap-4">
                      <li>
                        <input
                          type="radio"
                          id="delivery-usa"
                          name="delivery"
                          value="delivery-usa"
                          className="peer hidden"
                          checked
                        />
                        <label
                          form="delivery-usa"
                          className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                        >
                          <div className="block">
                            <div className="w-full text-lg font-semibold">
                              USA
                            </div>
                            <div className="w-full">Delivery only form USA</div>
                          </div>
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          id="delivery-europe"
                          name="delivery"
                          value="delivery-europe"
                          className="peer hidden"
                        />
                        <label
                          form="delivery-europe"
                          className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                        >
                          <div className="block">
                            <div className="w-full text-lg font-semibold">
                              Europe
                            </div>
                            <div className="w-full">Delivery only form USA</div>
                          </div>
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          id="delivery-asia"
                          name="delivery"
                          value="delivery-asia"
                          className="peer hidden"
                          checked
                        />
                        <label
                          form="delivery-asia"
                          className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                        >
                          <div className="block">
                            <div className="w-full text-lg font-semibold">
                              Asia
                            </div>
                            <div className="w-full">Delivery only form Asia</div>
                          </div>
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          id="delivery-australia"
                          name="delivery"
                          value="delivery-australia"
                          className="peer hidden"
                        />
                        <label
                          form="delivery-australia"
                          className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                        >
                          <div className="block">
                            <div className="w-full text-lg font-semibold">
                              Australia
                            </div>
                            <div className="w-full">
                              Delivery only form Australia
                            </div>
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 rounded-b p-4 dark:border-gray-600 md:p-5">
                <button
                  type="submit"
                  className="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                >
                  Show 50 results
                </button>
                <button
                  type="reset"
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>


    </div>
  );
}
