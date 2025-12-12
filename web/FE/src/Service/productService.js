import axios from "axios";

export const axiosJWT = axios.create();
const API = import.meta.env.VITE_API_BACKEND;

export const getProductByCategory = async (categoryId) => {
    const res = await axios.get(
        `${API}/products/category?categoryId=${categoryId}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
    );
    return res.data; 
};