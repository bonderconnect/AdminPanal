import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_BASEURL,
	headers: { 'x-device-platform': 'web' }
});

export default axiosInstance;
