import api from "./api";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

// function setCookie(name, value, days) {
//     let expires = "";
//     if (days) {
//         const date = new Date();
//         date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + value + expires + "; path=/";
// }

// function deleteCookie(name) {
//     document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// }

export function retriveDataFromJWTToken() {
    const token = Cookies.get("userToken");
    if (!token) return null;

    const decoded = jwtDecode(token);

    const usersIdRaw = decoded.usersId;
    const usersId = usersIdRaw ? Number(usersIdRaw) : null;

    const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    return { usersId, email, role };
}


// // -------------------- API functions --------------------
// export const login = async (email, password) => {
//     // console.log("authService login called", { email, password });
//     const formData = new URLSearchParams();
//     formData.append('email', email);
//     formData.append('password', password);
//     try {

//         const res = await api.post("/login", formData);
//         // console.log("res in auth: ", res);
//         if (res.data.status === true) {
//             setCookie("userToken", res.data.data, 1);
//         }
//         return res.data;
//     } catch (error) {
//         if (error.response && error.response.data) {
//             return error.response.data;
//         }
//         return { status: false, message: "Login failed due to server error" };
//     }
// };


// export const register = async (payload) => {
//     const formData = new FormData();

//     Object.keys(payload).forEach((key) => {
//         formData.append(key, payload[key]);
//     });

//     return api.post("/register", formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//     }).then(res => res.data);
// };


// export const getAllUsers = async () => {
//     return api.get("/getAllUsers");
// };

// export const getUserProfile = () => {
//     return api
//         .get("/getUserProfileByEmail")
//         .then((res) => res.data);
// };


// export const logout = async () => {
//     deleteCookie("userToken");
//     return { status: true, message: "Logged out successfully." };
// };

// unread msg instent show ho rha h reciver ke side me but first 2 users jo connected h unke liye hi ho rha h not for new third user, photos ko download krvana h reciver side and direct save krvana h na ki download ka option de kr new tab me open krna h