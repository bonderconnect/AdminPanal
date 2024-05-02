import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getMachineryCompanies = createAsyncThunk(
	'machineryCompaniesApp/machineryCompanies/getMachineryCompanies',
	async (params, { dispatch, getState }) => {
		params = params || getState().machineryCompaniesApp.machineryCompanies.params;
		const response = await axios
			.get('/users/machinery-company-profiles', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { machineryCompanyProfiles } = response.data;

		const count = response.data._meta.total_count;
		return { machineryCompanyProfiles, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const machineryCompaniesAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
export const { selectAll: selectMachineryCompanies } = machineryCompaniesAdapter.getSelectors(
	state => state.machineryCompaniesApp.machineryCompanies
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

const machineryCompaniesSlice = createSlice({
	name: 'machineryCompaniesApp/machineryCompanies',
	initialState: machineryCompaniesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getMachineryCompanies.pending]: state => {
			state.loading = true;
		},
		[getMachineryCompanies.rejected]: state => {
			state.loading = false;
		},
		[getMachineryCompanies.fulfilled]: (state, action) => {
			const { machineryCompanyProfiles, count } = action.payload;
			machineryCompaniesAdapter.setAll(state, machineryCompanyProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			machineryCompaniesAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					machineryCompaniesAdapter.updateOne(state, {
						id: item.user_id,
						changes: { app_version: item.app_version }
					});
				});
			}
		}
	}
});

export const { setParams } = machineryCompaniesSlice.actions;
export default machineryCompaniesSlice.reducer;
