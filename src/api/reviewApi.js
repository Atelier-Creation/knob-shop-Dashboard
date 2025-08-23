import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/reviews`;


export const getAllReviews = async () => {
    const res = await axios.get(`${BASE_URL}`);
    return res.data;
};

export const getReviewsByProduct = async (productId) => {
    const res = await axios.get(`${BASE_URL}/${productId}`);
    return res.data;
};
// reviewApi.js
export const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("authToken");
  
    const res = await axios.delete(`${BASE_URL}/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.data;
  };
  