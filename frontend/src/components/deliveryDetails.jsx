import React, { useState, useEffect } from "react";


export default function DeliveryDetails() {


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const countries = [
        { code: "+1", name: "US", flag: "fi fi-us" },
        { code: "+44", name: "UK", flag: "fi fi-gb" },
        { code: "+91", name: "IN", flag: "fi fi-in" },
        { code: "+81", name: "JP", flag: "fi fi-jp" },
      ];

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    useEffect(() => {
        const button = document.getElementById('dropdown-phone-button-3');

        const handleClick = () => {
            setIsDropdownOpen(prevState => !prevState);
        };

        if (button) {
            button.addEventListener('click', handleClick);
        }

        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };
    }, []);

    const handleSelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
    };

     const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
     }

    return (

        <div>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <form  onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                        <div className="min-w-0 flex-1 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery
                                    Details</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label form="your_name"
                                               className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your
                                            name </label>
                                        <input type="text" id="your_name"
                                               name='name'
                                               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                               placeholder="Bonnie Green" required/>
                                    </div>

                                    <div>
                                        <label form="your_email"
                                               className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your
                                            email* </label>
                                        <input type="email" id="your_email"
                                               name="email"
                                               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                               placeholder="name@flowbite.com" required/>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <label form="select-country-input-3"
                                                   className="block text-sm font-medium text-gray-900 dark:text-white"> Country* </label>
                                        </div>
                                        <select id="select-country-input-3"
                                                name="country"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                                            <option selected>United States</option>
                                            <option >Australia</option>
                                            <option >France</option>
                                            <option >Spain</option>
                                            <option >United Kingdom</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <label form="select-city-input-3"
                                                   className="block text-sm font-medium text-gray-900 dark:text-white"> City* </label>
                                        </div>
                                        <select id="select-city-input-3"
                                                name="city"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                                            <option selected>San Francisco</option>
                                            <option >New York</option>
                                            <option >Los Angeles</option>
                                            <option >Chicago</option>
                                            <option >Houston</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label form="phone-input-3"
                                               className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone
                                            Number* </label>
                                        <div className="flex items-center">
                                            <button id="dropdown-phone-button-3" data-dropdown-toggle="dropdown-phone-3"
                                                    className="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                    type="button">
                                                <span className={`me-2 ${selectedCountry.flag}`}/>
                                                {selectedCountry.code}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                                                </svg>
                                            </button>
                                            <div id="dropdown-phone-3"
                                                 className={`z-10 ${isDropdownOpen ? '' : 'hidden'} absolute top-96 w-56 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700`}>
                                                <ul className="p-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    aria-labelledby="dropdown-phone-button-3">
                                                    {countries.map((country) => (
                                                        <li key={country.code}>
                                                            <button type="button" onClick={() => handleSelect(country)}
                                                                    className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    role="menuitem">
                                                                <span className="inline-flex items-center">
                                                                    <span className={`me-2 ${country.flag}`}></span>
                                                                    {country.name} ({country.code})
                                                                </span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="relative w-full">
                                                <input type="text" id="phone-input"
                                                       className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                                                       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890"
                                                       name="phone-number"
                                                       required/>
                                            </div>
                                        </div>
                                    </div>




                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input id="credit-card" aria-describedby="credit-card-text" type="radio"
                                                       name="payment-method" value="credit-card"
                                                       className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                                       checked/>
                                            </div>

                                            <div className="ms-4 text-sm">
                                                <label form="credit-card"
                                                       className="font-medium leading-none text-gray-900 dark:text-white"> Credit
                                                    Card </label>
                                                <p id="credit-card-text"
                                                   className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay
                                                    with your credit card</p>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>


                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery
                                    Methods</h3>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input id="dhl" aria-describedby="dhl-text" type="radio"
                                                       name="delivery-method" value="via-courier"
                                                       className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"

                                                       required
                                                />
                                            </div>

                                            <div className="ms-4 text-sm">
                                                <label form="dhl"
                                                       className="font-medium leading-none text-gray-900 dark:text-white"> $15
                                                    - via courier </label>
                                                <p id="dhl-text"
                                                   className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Get
                                                    it by Tomorrow</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input id="fedex" aria-describedby="fedex-text" type="radio"
                                                       name="delivery-method" value="delivery-point"
                                                       className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                                       required
                                                />
                                            </div>

                                            <div className="ms-4 text-sm">
                                                <label form="fedex"
                                                       className="font-medium leading-none text-gray-900 dark:text-white"> Free
                                                    Delivery - from the company delivery point </label>
                                                <p id="fedex-text"
                                                   className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Delivered
                                                    within 1-2 days</p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <div>
                                <label form="voucher"
                                       className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Enter a
                                    gift card, voucher or promotional code </label>
                                <div className="flex max-w-md items-center gap-4">
                                    <input type="text" id="voucher"
                                           className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                           placeholder="Enter gift code" name="gift-code" />
                                    <button type="button"
                                            className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Apply
                                    </button>
                                </div>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-800 px-12 flex text-center py-2.5 text-white rounded-lg" type="submit">Save</button>
                        </div>


                    </div>
                </form>
            </section>


        </div>
    );
}
 