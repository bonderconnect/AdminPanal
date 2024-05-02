import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const createCustomer = createAsyncThunk(
	'customersApp/customerDialog/createCustomer',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		const createUserRequestData = {
			email: form.email,
			status_value: form.status_value,
			password: form.password,
			user_roles: ['USER']
		};

		if (form.phone) {
			createUserRequestData.phone = form.phone;
		}

		// Validation form with server side
		const promises = [];

		promises.push(
			axios
				.post('/auth/is-email-phone-username-unique', { email_or_phone_or_username: form.email })
				.then(helpers.parseApiResponse)
		);

		if (form.phone) {
			promises.push(
				axios
					.post('/auth/is-email-phone-username-unique', { email_or_phone_or_username: form.phone })
					.then(helpers.parseApiResponse)
			);
		} else {
			Promise.resolve(true);
		}

		const [emailValidationResponse, phoneValidationResponse] = await Promise.all(promises);

		const validationErrors = {};
		if (!emailValidationResponse.data) {
			validationErrors.email = {
				message: 'Email is not available!'
			};
		}

		if (form.phone && !phoneValidationResponse.data) {
			validationErrors.phone = {
				message: 'Phone is not available!'
			};
		}

		if (Object.keys(validationErrors).length) {
			return rejectWithValue({
				errors: validationErrors
			});
		}

		const createUserResponse = await axios.post('/user', createUserRequestData);
		const { userId } = createUserResponse.data.data[0];

		const updateUserRequestData = { profile_fields: { name: form.name } };
		await axios.patch(`/user/${userId}`, updateUserRequestData);

		const sendWelcomeEmailPayload = { password: form.password, user_id: userId };
		axios.post('/auth/send-welcome-email-with-login-credentials', sendWelcomeEmailPayload);

		if (payload.callback) {
			payload.callback();
		}
		return userId;
	}
);

export const updateCustomer = createAsyncThunk(
	'customersApp/customerDialog/updateCustomer',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		const { userId } = getState().customersApp.customerDialog.data;
		const updateUserRequestData = {
			email: form.email,
			status_value: parseInt(form.status_value, 2),
			profile_fields: {
				name: form.name
			}
		};

		if (form.phone) {
			updateUserRequestData.phone = form.phone;
		}

		try {
			await axios.patch(`/user/${userId}`, updateUserRequestData);

			if (payload.callback) {
				payload.callback();
			}
			return null;
		} catch (errorCatched) {
			const errors = errorCatched.response && errorCatched.response.data && errorCatched.response.data.info;
			if (Array.isArray(errors)) {
				const validationErrors = {};
				errors.forEach(error => {
					if (error === 'email already exist') {
						validationErrors.email = {
							message: 'Email is not available!'
						};
					}
					if (error === 'phone already exist') {
						validationErrors.phone = {
							message: 'Phone is not available!'
						};
					}
				});
				return rejectWithValue({
					errors: validationErrors
				});
			}
		}
		return null;
	}
);

export const openEditCustomerDialog = createAsyncThunk(
	'customersApp/customerDialog/openEditCustomerDialog',
	async userId => {
		const getUserResponse = await axios.get(`/user/${userId}`);
		const user = getUserResponse.data.data[0];
		const form = {
			email: user.email,
			status_value: user.status_value
		};

		if (user.phone) {
			form.phone = user.phone;
		}
		if (user.profile_fields && user.profile_fields.name) {
			form.name = user.profile_fields.name;
		}
		return form;
	}
);

const initialState = {
	type: 'new',
	open: false,
	form: {},
	data: {},
	submitting: false,
	errors: null,
	loading: false
};

const customerDialogueSlice = createSlice({
	name: 'customersApp/customerDialog',
	initialState,
	reducers: {
		openNewCustomerDialog: () => {
			return { ...initialState, open: true };
		},
		closeDialog: state => {
			state.open = false;
		}
	},
	extraReducers: {
		[createCustomer.pending]: (state, action) => {
			state.submitting = true;
		},
		[createCustomer.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[createCustomer.fulfilled]: (state, action) => {
			state.open = false;
		},
		[openEditCustomerDialog.pending]: (state, action) => {
			const userId = action.meta.arg;
			state.type = 'edit';
			state.open = true;
			state.loading = true;
			state.submitting = false;
			state.data = { userId };
		},
		[openEditCustomerDialog.fulfilled]: (state, action) => {
			state.form = action.payload;
			state.loading = false;
		},
		[updateCustomer.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[updateCustomer.pending]: state => {
			state.submitting = true;
		},
		[updateCustomer.fulfilled]: state => {
			state.submitting = true;
			state.open = false;
		}
	}
});

export const { openNewCustomerDialog, closeDialog } = customerDialogueSlice.actions;

export default customerDialogueSlice.reducer;
