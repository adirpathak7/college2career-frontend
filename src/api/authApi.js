import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (data) => {
    return axios.post(`${BASE_URL}/login`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const registerUser = async (data) => {
    return axios.post(`${BASE_URL}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
