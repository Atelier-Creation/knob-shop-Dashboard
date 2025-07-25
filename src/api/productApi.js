import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/products`;

export const createProduct = async (data) => {
  const authToken = localStorage.getItem("authToken");

  const res = await axios.post(`${BASE_URL}`, data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return res.data;
};


  export const getAllProducts = async () => {
    const res = await axios.get(`${BASE_URL}`);
    return res.data;
  };

  export const getProductById = async (id) => {
      const res = await axios.get(`${BASE_URL}/${id}`);
      return res.data;
    };

  export const updateProduct = async (id, data) => {
    const authToken = localStorage.getItem("authToken");

    const res = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return res.data;
  }

  export const deleteProduct = async (id) => {
    const authToken = localStorage.getItem("authToken");

    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return res.data;
  }