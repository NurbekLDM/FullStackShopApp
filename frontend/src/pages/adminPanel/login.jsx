import React, {useState} from 'react';
import { useNavigate} from 'react-router-dom';
import {loginAdmin} from "../../servers/admin";


export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");


    const handleLogin = async (e)=>{
        e.preventDefault();
        console.log('Username:', username, 'Password:', password);

        try{
            const response = await loginAdmin({username, password});
            navigate("/adminPanel");
            const {token} = response;
            localStorage.setItem("admin-token", token);
            console.log(response);

        } catch(err){
            if (err.response) {
                console.error('Error Response:', err.response.data); // More detailed error message
                setError('Invalid username or password');
            } else {
                console.error('Error:', err.message); // Handle network errors or other types of errors
            }
        }

    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div
                className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login to your account
                </h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )


}