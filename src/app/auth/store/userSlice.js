import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase';
import history from '@history';
import _ from '@lodash';
import axios from 'app/utils/axios';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import helper from 'app/utils/helpers';

export const loadConfigData = () => async dispatch => {
	const configSystemResponse = await axios
		.request({
			url: '/get-config/by-keys',
			data: {
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJjb25maWdBY2Nlc3NUb2tlbiIsImlhdCI6MTYwNDY1NzExOH0.8KnMZJMzEkfGquUfSJ9z61dr_Rxs4YxRpOoW7SYHlvM', // process.env.REACT_APP_PLATFORM_ACCESS_TOKEN,
				keys: [
					'app.youtube_key', // Youtube player key
					'system.free_user_default_subscription_id',
					'system.general_cloud_bucket_region',
					'system.general_cloud_bucket',
					'system.uploads_cloud_bucket_region',
					'system.uploads_cloud_bucket'
				]
			},
			method: 'POST'
		})
		.then(response => helper.parseApiResponseV2(response));

	const configSystem = configSystemResponse.data;
	const appConfigSystem = {};
	configSystem.forEach(element => {
		appConfigSystem[element.key] = element.value;
	});
	window.config = appConfigSystem;
};

export const setUserDataAuth0 = tokenData => async dispatch => {
	const user = {
		role: ['admin'],
		from: 'auth0',
		data: {
			displayName: tokenData.username || tokenData.name,
			photoURL: tokenData.picture,
			email: tokenData.email,
			settings:
				tokenData.user_metadata && tokenData.user_metadata.settings ? tokenData.user_metadata.settings : {},
			shortcuts:
				tokenData.user_metadata && tokenData.user_metadata.shortcuts ? tokenData.user_metadata.shortcuts : []
		}
	};

	return dispatch(setUserData(user));
};

export const setUserDataFirebase = (user, authUser) => async dispatch => {
	if (
		user &&
		user.data &&
		user.data.settings &&
		user.data.settings.theme &&
		user.data.settings.layout &&
		user.data.settings.layout.style
	) {
		// Set user data but do not update
		return dispatch(setUserData(user));
	}

	// Create missing user settings
	return dispatch(createUserSettingsFirebase(authUser));
};

export const createUserSettingsFirebase = authUser => async (dispatch, getState) => {
	const guestUser = getState().auth.user;
	const fuseDefaultSettings = getState().fuse.settings.defaults;
	const { currentUser } = firebase.auth();

	/**
	 * Merge with current Settings
	 */
	const user = _.merge({}, guestUser, {
		uid: authUser.uid,
		from: 'firebase',
		role: ['admin'],
		data: {
			displayName: authUser.displayName,
			email: authUser.email,
			settings: { ...fuseDefaultSettings }
		}
	});
	currentUser.updateProfile(user.data);

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const setUserData = user => async (dispatch, getState) => {
	/*
        You can redirect the logged-in user to a specific route depending on his role
         */

	history.location.state = {
		redirectUrl: user.redirectUrl // for example 'apps/academy'
	};

	/*
    Set User Settings
     */
	dispatch(setDefaultSettings(user.data.settings));

	return dispatch(setUser(user));
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.user_role || user.user_role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/login'
	});

	switch (user.from) {
		case 'firebase': {
			firebaseService.signOut();
			break;
		}
		case 'auth0': {
			auth0Service.logout();
			break;
		}
		default: {
			jwtService.logout();
		}
	}

	dispatch(setInitialSettings());

	return dispatch(userLoggedOut());
};

export const updateUserData = user => async (dispatch, getState) => {
	if (!user.user_role || user.user_role.length === 0) {
		// is guest
		return;
	}
	switch (user.from) {
		case 'firebase': {
			firebaseService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved to firebase' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
		case 'auth0': {
			auth0Service
				.updateUserData({
					settings: user.data.settings,
					shortcuts: user.data.shortcuts
				})
				.then(() => {
					dispatch(showMessage({ message: 'User data saved to auth0' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
		default: {
			jwtService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved with api' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
	}
};

const initialState = {
	user_role: [], // guest
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	},
	config: null
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
