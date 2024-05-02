import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getMachineries = createAsyncThunk(
	'machineriesApp/machineries/getMachineries',
	async (params, { dispatch, getState }) => {
		params = params || getState().machineriesApp.machineries.params;
		const response = await axios
			.get('/machinery-products-with-company-profile', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { products: machineries } = response.data;

		const count = response.data._meta.total_count;
		return { machineries, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const machineriesAdapter = createEntityAdapter({ selectId: entity => entity.product_id });
export const { selectAll: selectMachineries } = machineriesAdapter.getSelectors(
	state => state.machineriesApp.machineries
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

const machineriesSlice = createSlice({
	name: 'machineriesApp/machineries',
	initialState: machineriesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getMachineries.pending]: state => {
			state.loading = true;
		},
		[getMachineries.rejected]: state => {
			state.loading = false;
		},
		[getMachineries.fulfilled]: (state, action) => {
			const { machineries, count } = action.payload;
			machineriesAdapter.setAll(state, machineries);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			machineriesAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					machineriesAdapter.updateOne(state, {
						id: item.user_id,
						changes: { app_version: item.app_version }
					});
				});
			}
		}
	}
});

export const { setParams } = machineriesSlice.actions;
export default machineriesSlice.reducer;
