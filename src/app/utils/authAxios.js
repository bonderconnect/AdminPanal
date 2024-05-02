import axios from 'axios';

const authAxios = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL });

authAxios.interceptors.request.use(
	requestConfig => {
		const accessToken = window.accessToken || process.env.REACT_APP_PLATFORM_ACCESS_TOKEN;

		if (!accessToken) {
			return Promise.reject(new Error('accessToken missing'));
		}
		requestConfig.headers.Authorization = `Bearer ${accessToken}`;
		return requestConfig;
	},
	error => {
		return Promise.reject(error);
	}
);

authAxios.interceptors.response.use(
	response => response,
	error => error
);

const noAuthAxios = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL });

export { authAxios, noAuthAxios };
