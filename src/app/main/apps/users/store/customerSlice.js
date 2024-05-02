import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomer } from 'app/services/apiServices/customer';
// Customer Profile

export const fetchCustomerProfile = createAsyncThunk(
	'usersApp/users/fetchCustomerProfile',
	async (params, { dispatch, getState }) => {
		params = params || getState().usersApp.users.params;
		const response = await getCustomer({ params });

		const loading = false;
		const { customerProfile } = response.data;
		// dispatch(getUsersLatestAppVersion(customerProfile.map(item => customerProfile.user_id)));
		const count = response.data._meta.total_count;
		return { customerProfile, count, params, loading };
	}
);

const customerProfileSlice = createSlice({
	name: 'usersApp/customer',
	initialState: {
		customerProfile: null,
		loading: false,
		error: null
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCustomerProfile.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCustomerProfile.fulfilled, (state, action) => {
				state.customerProfile = action.payload.customerProfile;
				state.loading = false;
			})
			.addCase(fetchCustomerProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	}
});

export default customerProfileSlice.reducer;
