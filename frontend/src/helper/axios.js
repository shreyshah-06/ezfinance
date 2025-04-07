import axios from "axios";

const token = window.localStorage.getItem("token");
const API_URI = process.env.REACT_APP_BASE_URL_API
const API_KEY  = process.env.REACT_APP_API_KEY

const axiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": API_KEY,
  },
});

axiosInstance.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }
    req.headers["x-api-key"] = API_KEY;
    return req;
})

export default axiosInstance;