import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getUsers = createAsyncThunk('usersApp/users/getUsers', async (params, { dispatch, getState }) => {
	params = params || getState().usersApp.users.params;
	const response = await axios
		.get('/users', { params })
		.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));

	const loading = false;
	const { users } = response.data;
	dispatch(getUsersLatestAppVersion(users.map(item => users.user_id)));
	const count = response.data._meta.total_count;
	return { users, count, params, loading };
});

export const getSubscriptionsAvailable = createAsyncThunk(
	'usersApp/users/getSubscriptionsAvailable',
	async (_, { getState }) => {
		const response = await axios
			.get('/subscriptions/available')
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
		const data = await response.data;

		return data.length ? data.map(item => ({ ...item, id: item.subscription_id })) : data;
	}
);

export const getUserSubscriptions = createAsyncThunk(
	'usersApp/users/getUserSubscriptions',
	async (userId, { getState }) => {
		const response = await axios
			.get(`user/${userId}/subscriptions/package/active`)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
		const data = await response.data;
		return data.length ? data.map(item => ({ ...item, id: item.subscription_id })) : data;
	}
);

export const addUser = createAsyncThunk(
	'usersApp/users/addUser',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { user } = payload;
		const createUserPayload = {
			email: user.email,
			password: user.password,
			status_value: user.status_value,
			user_roles: user.user_roles
		};
		if (user.phone) {
			createUserPayload.phone = user.phone;
		}

		// Validation form with server side
		const promises = [];

		promises.push(
			axios
				.post('/auth/is-email-phone-username-unique', { email_or_phone_or_username: user.email })
				.then(helpers.parseApiResponse)
		);

		if (user.phone) {
			promises.push(
				axios
					.post('/auth/is-email-phone-username-unique', { email_or_phone_or_username: user.phone })
					.then(helpers.parseApiResponse)
			);
		} else {
			Promise.resolve(true);
		}

		const [emailValidationResponse, phoneValidationResponse] = await Promise.all(promises);

		const validationErrors = {};
		if (!emailValidationResponse.data) {
			validationErrors.email = {
				withValue: user.email,
				error: 'Email is not available!'
			};
		}

		if (user.phone && !phoneValidationResponse.data) {
			validationErrors.phone = {
				withValue: user.phone,
				error: 'Phone is not available!'
			};
		}

		if (Object.keys(validationErrors).length) {
			return rejectWithValue({
				errors: validationErrors
			});
		}

		const createUserResponse = await axios.post('/user', createUserPayload).then(helpers.parseApiResponse);
		const { userId } = createUserResponse.data;

		// updating user name via patch method
		const patchUserPayload = { profile_fields: { name: user.name } };
		const patchUserResponse = await axios.patch(`/user/${userId}`, patchUserPayload).then(helpers.parseApiResponse);
		const createdUser = patchUserResponse.data;

		if (payload.closeNewUserDialog) {
			dispatch(closeNewUserDialog());
		}
		dispatch(getUsers());

		return createdUser;
	}
);

export const updateUser = createAsyncThunk('usersApp/users/updateUser', async (user, { dispatch, getState }) => {
	const patchUserPayload = {
		status_value: user.status_value,
		user_roles: user.user_roles,
		profile_fields: { name: user.name }
	};
	const response = await axios.patch(`/user/${user.id}`, patchUserPayload).then(helpers.parseApiResponse);
	const updatedUser = response.data;

	dispatch(getUsers());

	return updatedUser;
});

export const removeUser = createAsyncThunk('usersApp/users/removeUser', async (userId, { dispatch, getState }) => {
	const response = await axios.delete(`/user/${userId}`).then(helpers.parseApiResponse);
	const data = await response.data;
	dispatch(getUsers());

	return data;
});

export const updateUserSubscription = createAsyncThunk(
	'usersApp/users/updateSubscription',
	async (payload, { dispatch, getState }) => {
		const { deletedSubscriptions } = payload;
		const { newSubscriptions } = payload;
		const { userId } = payload;

		const promises = [];
		if (deletedSubscriptions.length) {
			promises.push(
				axios
					.post(`/user/${userId}/subscription/delete/by-subscription-ids`, {
						subscription_ids: deletedSubscriptions
					})
					.then(helpers.parseApiResponse)
			);
		}

		if (newSubscriptions.length) {
			promises.push(
				axios
					.post(`/user/${userId}/subscription/create/by-subscription-ids`, {
						subscription_ids: newSubscriptions
					})
					.then(helpers.parseApiResponse)
			);
		}

		if (promises.length) {
			await Promise.all(promises);
		}

		dispatch(getUsers());
	}
);

export const getUsersLatestAppVersion = createAsyncThunk(
	'usersApp/users/getUsersLatestAppVersion',
	async (userIds, { getState }) => {
		const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
		return result.data;
	}
);

export const openEditUserDialog = createAsyncThunk(
	'usersApp/users/openEditUserDialog',
	async (userId, { getState }) => {
		const getUserResult = await apiServicesUser.getUser({ urlParams: { userId } });
		const userData = getUserResult.data;
		const userDialogData = {
			id: userData.id,
			name: (userData.profile_fields && userData.profile_fields.name) || '',
			email: userData.email,
			phone: userData.phone,
			status_value: userData.status_value,
			user_roles: userData.user_role || []
		};
		return userDialogData;
	}
);

export const getUsersExcelExportDownloadUrl = createAsyncThunk(
	'usersApp/users/getUsersExcelExportDownloadUrl',
	async (_, { getState }) => {
		const { params } = getState().usersApp.users;
		const queryParams = { ...params };
		delete queryParams.page;
		delete queryParams.limit;
		const result = await apiServicesUser.getUsersExcelExportDownloadUrl({
			params: queryParams
		});

		const data = result.data && result.data.data;
		return data.download_url;
	}
);

const usersAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
const subscriptionsAdapter = createEntityAdapter({});
const userSubscriptionsAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUsersById } = usersAdapter.getSelectors(
	state => state.usersApp.users
);

const usersSlice = createSlice({
	name: 'usersApp/users',
	initialState: usersAdapter.getInitialState({
		searchText: '',
		loading: false,
		params: {
			page: 1,
			limit: 10
		},
		count: null,
		userDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			loading: false,
			submitting: false,
			errors: null
		},
		userSubscriptionDialog: {
			props: {
				open: false
			},
			userId: null,
			data: {
				userSubscriptions: userSubscriptionsAdapter.getInitialState(),
				subscriptions: subscriptionsAdapter.getInitialState()
			}
		},
		excelExport: {
			downloadUrl: null,
			loading: false
		}
	}),
	reducers: {
		setUsersSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setUsersParams: (state, action) => {
			state.params = action.payload;
		},
		setUsersLoading: (state, action) => {
			state.loading = action.payload;
		},
		setUsersCount: (state, action) => {
			state.count = action.payload;
		},
		openNewUserDialog: state => {
			state.userDialog = {
				type: 'new',
				props: {
					open: true
				},
				submitting: false,
				data: null,
				errors: null
			};
		},
		setNewUserDialogErrors: (state, action) => {
			state.userDialog.errors = action.payload;
		},
		closeNewUserDialog: state => {
			state.userDialog = {
				...state.userDialog,
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		closeEditUserDialog: (state, action) => {
			state.userDialog = {
				...state.userDialog,
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openUserSubscriptionDialog: (state, action) => {
			state.userSubscriptionDialog = {
				props: {
					open: true
				},
				userId: action.payload,
				data: {
					...state.userSubscriptionDialog.data, // Persisting loaded subscriptions
					userSubscriptions: userSubscriptionsAdapter.getInitialState()
				}
			};
		},
		closeUserSubscriptionDialog: (state, action) => {
			state.userSubscriptionDialog = {
				...state.userSubscriptionDialog,
				props: {
					open: false
				}
			};
		},
		resetExcelExportDownloadUrl: state => {
			state.excelExport.downloadUrl = null;
		}
	},
	extraReducers: {
		[updateUser.fulfilled]: usersAdapter.upsertOne,
		[addUser.fulfilled]: usersAdapter.addOne,
		[addUser.pending]: state => {
			state.userDialog.submitting = true;
		},
		[addUser.rejected]: (state, action) => {
			const { payload } = action;
			state.userDialog.submitting = false;
			state.userDialog.errors = payload.errors;
		},
		[getUsers.pending]: (state, action) => {
			state.loading = true;
		},
		[getUsers.fulfilled]: (state, action) => {
			const { users, params, loading, count } = action.payload;
			usersAdapter.setAll(state, users);
			state.params = params;
			state.loading = loading;
			state.searchText = '';
			state.count = count;
		},
		[getSubscriptionsAvailable.fulfilled]: (state, action) => {
			const data = action.payload;
			subscriptionsAdapter.setAll(state.userSubscriptionDialog.data.subscriptions, data);
		},
		[getUserSubscriptions.fulfilled]: (state, action) => {
			const data = action.payload;
			userSubscriptionsAdapter.setAll(state.userSubscriptionDialog.data.userSubscriptions, data);
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			usersAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					usersAdapter.updateOne(state, { id: item.user_id, changes: { app_version: item.app_version } });
				});
			}
		},
		[openEditUserDialog.pending]: (state, action) => {
			state.userDialog = {
				type: 'edit',
				props: {
					open: true
				},
				loading: true,
				data: null,
				errors: null
			};
		},
		[openEditUserDialog.fulfilled]: (state, action) => {
			state.userDialog.data = action.payload;
			state.userDialog.loading = false;
		},
		[getUsersExcelExportDownloadUrl.pending]: state => {
			state.excelExport.loading = true;
		},
		[getUsersExcelExportDownloadUrl.fulfilled]: (state, action) => {
			state.excelExport.downloadUrl = action.payload;
			state.excelExport.loading = false;
		}
	}
});

export const {
	setUsersParams,
	setUsersSearchText,
	openNewUserDialog,
	closeNewUserDialog,
	closeEditUserDialog,
	openUserSubscriptionDialog,
	closeUserSubscriptionDialog,
	setNewUserDialogErrors,
	resetExcelExportDownloadUrl
} = usersSlice.actions;

export default usersSlice.reducer;
