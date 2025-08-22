import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/user/auth`;
export const getAllUser = async()=>{
    const res = await axios.get(`${BASE_URL}/all-users`);
    return res;
  }

  export const getUserById = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/${userId}`);
      return res.data; // contains { user: { ... } }
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch user" };
    }
  };