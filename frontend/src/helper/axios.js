import axios from "axios";

const token = window.localStorage.getItem("token");
const API_URI = process.env.REACT_APP_BASE_URL_API
// const API_URI = 'http://localhost:5000/api'

const axiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

axiosInstance.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }
    return req;
})

export default axiosInstance;