import axios from 'axios';

const API_URL = 'https://full-stack-shop-app.vercel.app';

export const addCard = async (cardData) => {
    try {
        const response = await axios.post(`${API_URL}/addCard`, cardData);
        return response.data;
    } catch (error) {
        console.error('Error adding card:', error);
        throw error;
    }
};

// Edit an existing card
export const editCard = async (cardId, cardData) => {
    try {
        const response = await axios.put(`${API_URL}/Updatecard/${cardId}`, cardData);
        return response.data;
    } catch (error) {
        console.error('Error editing card:', error);
        throw error;
    }
};

// Get card by user ID
export const getCardByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/card/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching card:', error);
        throw error;
    }
};

// Delete a card
export const deleteCard = async (cardId) => {
    try {
        const response = await axios.delete(`${API_URL}/cards/${cardId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
    }
};