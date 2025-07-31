import axios from "axios";

// Use environment variable for backend base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8000",
  withCredentials: true, // needed for cookies/session support
});

export default API;
