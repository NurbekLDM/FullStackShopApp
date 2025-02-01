import axios from "axios";

const API_URL = 'https://full-stack-shop-app.vercel.app';

export const loginAdmin = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/adminLogin`, credentials, );
        return response.data;  // Ensure the response contains a 'token' in data
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;  // Let the caller handle the error
    }
};