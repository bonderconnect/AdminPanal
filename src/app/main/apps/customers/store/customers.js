import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getCustomers = createAsyncThunk(
	'customersApp/customers/getCustomers',
	async (params, { dispatch, getState }) => {
		params = params || getState().customersApp.customers.params;
		const response = await axios
			.get('/users/customer-profiles', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { customerProfiles } = response.data;

		console.log('customerProfiles:', customerProfiles);
		const count = response.data._meta.total_count;
		return { customerProfiles, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const customersAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
export const { selectAll: selectCustomers } = customersAdapter.getSelectors(state => state.customersApp.customers);

const initialState = {
	params: {
		page: 1,
		limit: 10
	},
	meta: {
		totalCount: null
	},
	loading: false
};

const customersSlice = createSlice({
	name: 'customersApp/customers',
	initialState: customersAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getCustomers.pending]: state => {
			state.loading = true;
		},
		[getCustomers.rejected]: state => {
			state.loading = false;
		},
		[getCustomers.fulfilled]: (state, action) => {
			const { customerProfiles, count } = action.payload;
			customersAdapter.setAll(state, customerProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			customersAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					customersAdapter.updateOne(state, { id: item.user_id, changes: { app_version: item.app_version } });
				});
			}
		}
	}
});

export const { setParams } = customersSlice.actions;
export default customersSlice.reducer;
