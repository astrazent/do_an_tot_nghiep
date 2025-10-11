import axios from "axios";

export const axiosJWT = axios.create();
const API = import.meta.env.VITE_API_BACKEND;

export const loginUser = async (data) => {
    const res = await axios.post(
        `${API}/auth/login`,
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
    );
    return res.data; 
};

export const RegisterUser = async (data) => {
    const res = await axios.post(
        `${API}/auth/register`,
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
    );
    return res.data; 
};