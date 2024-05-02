import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'app/utils/axios';
import helper from 'app/utils/helpers';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession({ accessToken: access_token });
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/login', {
					email_or_phone_or_username: email,
					password
				})
				.then(helper.parseApiResponse, helper.parseApiResponse)
				.then(response => {
					if (response.data && response.data.user) {
						this.setSession({
							accessToken: response.data.access_token,
							refreshToken: response.data.refresh_token
						});
						resolve(response.data.user);
					} else {
						reject(new Error('Invalid Credentials'));
					}
				});
		});
	};

	/** signin after inactivity or remembered session */
	signInWithRefreshToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/refresh-session', {
					refresh_token: this.getRefreshToken()
				})
				.then(helper.parseApiResponse)
				.then(response => {
					this.setSession({
						accessToken: response.data.accessToken,
						refreshToken: response.data.refresh_token
					});
				})
				.then(() =>
					axios
						.get('/user')
						.then(helper.parseApiResponse)
						.then(response => {
							if (response.data) {
								resolve(response.data);
							} else {
								this.logout();
								reject(new Error('Failed to login with token.'));
							}
						})
				)
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = session => {
		if (session) {
			const { accessToken, refreshToken } = session;
			localStorage.setItem('jwt_access_token', accessToken);

			// refresh token is optional here, so handling it here
			if (refreshToken) {
				localStorage.setItem('jwt_refresh_token', refreshToken);
			}
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('jwt_refresh_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};

	getRefreshToken = () => {
		return window.localStorage.getItem('jwt_refresh_token');
	};
}

const instance = new JwtService();

export default instance;
