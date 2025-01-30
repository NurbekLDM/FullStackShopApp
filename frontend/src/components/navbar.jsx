import React, {useEffect} from 'react';

export default function Navbar(){
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        if (isUserDropdownOpen){
            setIsDropdownOpen(false);
        }
        if(isDropdownOpen){
            setIsUserDropdownOpen(false);
        }
    }, [isUserDropdownOpen , isDropdownOpen]);

    useEffect(() => {
        const mobileMenuButton = document.querySelector('[data-collapse-toggle="ecommerce-navbar-menu-1"]');
        const handleClick = () => {
            setIsMobileMenuOpen(prevState => !prevState);
        };

        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', handleClick);
        }

        return () => {
            if (mobileMenuButton) {
                mobileMenuButton.removeEventListener('click', handleClick);
            }
        };
    }, []);


    useEffect(() => {
        const cartButton = document.getElementById('myCartDropdownButton1');
        const handleCartClick = () => {
            setIsDropdownOpen(prevState => !prevState);
        };

        if (cartButton) {
            cartButton.addEventListener('click', handleCartClick);
        }

        return () => {
            if (cartButton) {
                cartButton.removeEventListener('click', handleCartClick);
            }
        };
    }, []);

    useEffect(() => {
        const userButton = document.getElementById('userDropdownButton1');
        const handleUserClick = () => {
            setIsUserDropdownOpen(prevState => !prevState);
        };

        return () => {
            if (userButton) {
                userButton.addEventListener('click', handleUserClick);
            }
        };
    }, []);

    return (
        <nav className="bg-white dark:bg-gray-800 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                <div className="flex  items-center justify-between">
                    <div>
                        <a href="/" className="flex items-center space-x-2">Logo</a>
                    </div>
                    <div className="flex  items-center space-x-8">

                        <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                            <li>
                                <a href="/" title=""
                                   className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                    Home
                                </a>
                            </li>
                            <li className="shrink-0">
                                <a href="#" title=""
                                   className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                    Best Sellers
                                </a>
                            </li>
                            <li className="shrink-0">
                                <a href="#" title=""
                                   className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                    Gift Ideas
                                </a>
                            </li>
                            <li className="shrink-0">
                                <a href="#" title=""
                                   className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                    Today's Deals
                                </a>
                            </li>
                            <li className="shrink-0">
                                <a href="#" title=""
                                   className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                    Sell
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col  items-center lg:space-x-2">

                        <div className="flex flex-row items-center">
                            {/*My cart button */}
                            <button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button"
                                    className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                 <span className="sr-only"> Cart
                    </span>
                                <svg className="w-5 h-5  lg:me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                                </svg>
                                <span className="hidden  sm:flex">My Cart</span>
                            </button>
                            {/*My account button*/}
                            <button id="userDropdownButton1" data-dropdown-toggle="userDropdown1" type="button"
                                    className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                <svg className="w-5 h-5  me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2"
                                          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                                <span className="hidden  sm:flex">Account</span>

                            </button>

                            <button type="button" data-collapse-toggle="ecommerce-navbar-menu-1"
                                    aria-controls="ecommerce-navbar-menu-1" aria-expanded="false"
                                    className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white">
                                <span className="sr-only">
                                  Open Menu
                                  </span>
                                <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24"
                                     height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                          d="M5 7h14M5 12h14M5 17h14"/>
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>

              <div className='lg:justify-end lg:flex md:flex md:justify-end'>
                {/*Cart dropdown*/}
                <div id="myCartDropdown1"
                     className={` ${isDropdownOpen ? " " : "hidden"} z-10 absolute mx-auto max-w-sm space-y-4 overflow-hidden rounded-lg bg-white p-4  shadow-lg `}>
                    <div className="grid grid-cols-2">
                        <div>
                            <a href="#"
                               className="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">Apple
                                iPhone 15</a>
                            <p className="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">$599</p>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Qty:
                                1</p>

                            <button data-tooltip-target="tooltipRemoveItem1a" type="button"
                                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                                <span className="sr-only"> Remove </span>
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div id="tooltipRemoveItem1a" role="tooltip"
                                 className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                Remove item
                                <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div>
                            <a href="#"
                               className="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">Apple
                                iPad Air</a>
                            <p className="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">$499</p>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Qty:
                                1</p>

                            <button data-tooltip-target="tooltipRemoveItem2a" type="button"
                                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                                <span className="sr-only"> Remove </span>
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div id="tooltipRemoveItem2a" role="tooltip"
                                 className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                Remove item
                                <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div>
                            <a href="#"
                               className="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">Apple
                                Watch SE</a>
                            <p className="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">$598</p>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Qty:
                                2</p>

                            <button data-tooltip-target="tooltipRemoveItem3b" type="button"
                                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                                <span className="sr-only"> Remove </span>
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div id="tooltipRemoveItem3b" role="tooltip"
                                 className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                Remove item
                                <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div>
                            <a href="#"
                               className="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">Sony
                                Playstation 5</a>
                            <p className="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">$799</p>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Qty:
                                1</p>

                            <button data-tooltip-target="tooltipRemoveItem4b" type="button"
                                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                                <span className="sr-only"> Remove </span>
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div id="tooltipRemoveItem4b" role="tooltip"
                                 className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                Remove item
                                <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div>
                            <a href="#"
                               className="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">Apple
                                iMac 20"</a>
                            <p className="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">$8,997</p>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <p className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Qty:
                                3</p>

                            <button data-tooltip-target="tooltipRemoveItem5b" type="button"
                                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                                <span className="sr-only"> Remove </span>
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            <div id="tooltipRemoveItem5b" role="tooltip"
                                 className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                Remove item
                                <div className="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                    </div>

                    <a href="/checkout" title=""
                       className="mb-2 me-2 inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                       role="button"> Proceed to Checkout </a>
                </div>

                {/*User dropdown*/}
                <div id="userDropdown1"
                     className={` ${isUserDropdownOpen ? " " : "hidden"} z-10 absolute  w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white mt-4 shadow`}>
                    <ul className="p-2 text-start  text-sm font-medium text-gray-900 ">
                        <li><a href="#" title=""
                               className="inline-flex md:text-sm w-full  items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My
                            Account </a></li>
                        <li><a href="/orders" title=""
                               className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My
                            Orders </a></li>
                        <li><a href="#" title=""
                               className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Settings </a>
                        </li>
                        <li><a href="/favourites" title=""
                               className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Favourites </a>
                        </li>
                        <li><a href="#" title=""
                               className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Delivery
                            Addresses </a></li>
                        <li><a href="#" title=""
                               className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Billing
                            Data </a></li>
                    </ul>

                    <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                        <a href="#" title=""
                           className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Sign
                            Out </a>
                    </div>
                </div>

                </div>

                {/*Mobile menu*/}
                <div id="ecommerce-navbar-menu-1"
                     className={` ${isMobileMenuOpen ? "" : "hidden"} z-10 absolute w-full  bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3  px-4 mt-4 `}>
                    <ul className="text-gray-900 md:text-xl  text-sm font-medium space-y-3">
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Home</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Best Sellers</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Gift Ideas</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Games</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Electronics</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Home & Garden</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}