import axios from 'axios';

const API_URL = 'https://full-stack-shop-app.vercel.app';

export const addProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/products`, productData);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`${API_URL}/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const getProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const buyProduct = async (purchaseData) => {
    try {
        const response = await axios.post(`${API_URL}/buy-product`, purchaseData);
        return response.data;
    } catch (error) {
        console.error('Error buying product:', error);
        throw error;
    }
};

export const getUserPurchaseHistory = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/history/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user purchase history:', error);
        throw error;
    }
};

export const getAllPurchaseHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        throw error;
    }
};