import axios from "axios";

const API_URL = 'https://full-stack-shop-app.vercel.app';
const token = localStorage.getItem('token');

// get comment belong to product
export const getComments = async(id) => {
    try {
     const respnse = await axios.get(`${API_URL}/comments/${id}`,{
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return respnse.data;
} catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
}
}

export const addComment = async(comment) => {
    
    try{
    const response = await axios.post(`${API_URL}/addComment`, comment, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.data;
} catch (error) {
    console.error('Error adding comment:', error);
    throw error;
}
}

export const updateComment = async(id,comment) => {
    try{
    const response = await axios.put(`${API_URL}/updateComment/${id}`, comment, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
        },
    });
    return response.data;
} catch (error) {
    console.error('Error updating comment:', error);
    throw error;
}
}

export const deleteComment = async(id) =>{
    try{
     const response = await axios.delete(`${API_URL}/deleteComment/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.data;
} catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
}
}

// get all comments
export const getAllComments = async() => {
    try {
     const respnse = await axios.get(`${API_URL}/comments`,{
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return respnse.data;
} catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
}
}