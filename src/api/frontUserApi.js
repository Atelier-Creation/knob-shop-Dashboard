import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/user/auth`;
export const getAllUser = async()=>{
    const res = await axios.get(`${BASE_URL}/all-users`);
    return res;
  }