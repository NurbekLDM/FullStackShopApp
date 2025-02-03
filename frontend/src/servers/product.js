import axios from 'axios';

const API_URL = 'https://full-stack-shop-app.vercel.app';


export const addProduct = async (formData) => {
    try {
        const token = localStorage.getItem('admin-token');
        const response = await axios.post(`${API_URL}/addProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        // Error handling remains the same
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`${API_URL}/updateProduct/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteProduct/${productId}`);
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

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const addCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/addCategory`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteCategory/${categoryId}`);
        return response.data;
} catch (error) {
    console.error('Error deleting category:', error);
    throw error;
}
}

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/updateCategory/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        console.log(response.data);
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

export const searchProducts = async (searchQuery) => {
    try {
        const response = await axios.get(`${API_URL}/search?q=${searchQuery}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};