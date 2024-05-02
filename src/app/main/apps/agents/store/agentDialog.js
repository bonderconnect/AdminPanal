import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const createAgent = createAsyncThunk(
	'agentsApp/agentDialog/createAgent',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		console.log(`🚀  payload:`, payload);
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
		if (form.status_value === 'active' && form.user_Id) {
			const sendActiveNotify = await axios.post(`/agent-profiles/confirm-by-admin/${form.user_Id}`);
			console.log(`🚀  sendActiveNotify:`, sendActiveNotify);
		}

		const sendWelcomeEmailPayload = { password: form.password, user_id: userId };
		axios.post('/auth/send-welcome-email-with-login-credentials', sendWelcomeEmailPayload);

		if (payload.callback) {
			payload.callback();
		}
		return userId;
	}
);

export const updateAgent = createAsyncThunk(
	'agentsApp/agentDialog/updateAgent',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		const { userId } = getState().agentsApp.agentDialog.data;
		const updateUserRequestData = {
			email: form.email,
			status: form.status_value,
			phone: form.phone,
			profile_fields: {
				name: form.name
			}
		};

		if (form.phone) {
			updateUserRequestData.phone = form.phone;
		}

		try {
			const res = await axios.patch(`/user/agent-profile-status/${userId}`, updateUserRequestData);
			if (form.status_value === 'active' && form.user_Id) {
				console.log(`🚀  form.user_Id:`, form.user_Id);
				const sendActiveNotify = await axios.post(`/agent-profiles/confirm-by-admin/${form.user_Id}`);
				console.log(`🚀  sendActiveNotify:`, sendActiveNotify);
			}

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

export const openEditAgentDialog = createAsyncThunk('agentsApp/agentDialog/openEditAgentDialog', async userId => {
	const getUserResponse = await axios.get(`/user/${userId}`);
	const getAgentResponse = await axios.get(`/user/agent-profile/${userId}`);
	const user = getUserResponse.data.data[0];
	const agent = getAgentResponse.data.data.agent_profile;
	console.log(`🚀  openEditAgentDialog  agent:`, agent);
	const form = {
		email: agent.email,
		status_value: agent.status,
		user_Id: userId
	};

	if (user.phone) {
		form.phone = user.phone;
	}
	if (user.profile_fields && user.profile_fields.name) {
		form.name = user.profile_fields.name || user.data.displayName;
	} else {
		form.name = user.data.displayName;
	}
	console.log(`🚀  openEditAgentDialog  form:`, form);
	return form;
});

const initialState = {
	type: 'new',
	open: false,
	form: {},
	data: {},
	submitting: false,
	errors: null,
	loading: false
};

const agentDialogueSlice = createSlice({
	name: 'agentsApp/agentDialog',
	initialState,
	reducers: {
		openNewAgentDialog: () => {
			return { ...initialState, open: true };
		},
		closeDialog: state => {
			state.open = false;
		}
	},
	extraReducers: {
		[createAgent.pending]: (state, action) => {
			state.submitting = true;
		},
		[createAgent.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[createAgent.fulfilled]: (state, action) => {
			state.open = false;
		},
		[openEditAgentDialog.pending]: (state, action) => {
			const userId = action.meta.arg;
			state.type = 'edit';
			state.open = true;
			state.loading = true;
			state.submitting = false;
			state.data = { userId };
		},
		[openEditAgentDialog.fulfilled]: (state, action) => {
			state.form = action.payload;
			state.loading = false;
		},
		[updateAgent.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[updateAgent.pending]: state => {
			state.submitting = true;
		},
		[updateAgent.fulfilled]: state => {
			state.submitting = true;
			state.open = false;
		}
	}
});

export const { openNewAgentDialog, closeDialog } = agentDialogueSlice.actions;

export default agentDialogueSlice.reducer;
