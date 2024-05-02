import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getServiceCompanies = createAsyncThunk(
	'serviceCompaniesApp/serviceCompanies/getServiceCompanies',
	async (params, { dispatch, getState }) => {
		params = params || getState().serviceCompaniesApp.serviceCompanies.params;
		const response = await axios
			.get('/users/service-company-profiles', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { serviceCompanyProfiles } = response.data;

		const count = response.data._meta.total_count;
		return { serviceCompanyProfiles, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const serviceCompaniesAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
export const { selectAll: selectServiceCompanies } = serviceCompaniesAdapter.getSelectors(
	state => state.serviceCompaniesApp.serviceCompanies
);

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

const serviceCompaniesSlice = createSlice({
	name: 'serviceCompaniesApp/serviceCompanies',
	initialState: serviceCompaniesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getServiceCompanies.pending]: state => {
			state.loading = true;
		},
		[getServiceCompanies.rejected]: state => {
			state.loading = false;
		},
		[getServiceCompanies.fulfilled]: (state, action) => {
			const { serviceCompanyProfiles, count } = action.payload;
			serviceCompaniesAdapter.setAll(state, serviceCompanyProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			serviceCompaniesAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					serviceCompaniesAdapter.updateOne(state, {
						id: item.user_id,
						changes: { app_version: item.app_version }
					});
				});
			}
		}
	}
});

export const { setParams } = serviceCompaniesSlice.actions;
export default serviceCompaniesSlice.reducer;
