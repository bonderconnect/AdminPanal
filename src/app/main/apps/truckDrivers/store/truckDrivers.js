import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getTruckDrivers = createAsyncThunk(
	'truckDriversApp/truckDrivers/getTruckDrivers',
	async (params, { dispatch, getState }) => {
		params = params || getState().truckDriversApp.truckDrivers.params;
		const response = await axios
			.get('/users/truck-driver-profiles', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { truckDriverProfiles } = response.data;

		const count = response.data._meta.total_count;
		return { truckDriverProfiles, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const truckDriversAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
export const { selectAll: selectTruckDrivers } = truckDriversAdapter.getSelectors(
	state => state.truckDriversApp.truckDrivers
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

const truckDriversSlice = createSlice({
	name: 'truckDriversApp/truckDrivers',
	initialState: truckDriversAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getTruckDrivers.pending]: state => {
			state.loading = true;
		},
		[getTruckDrivers.rejected]: state => {
			state.loading = false;
		},
		[getTruckDrivers.fulfilled]: (state, action) => {
			const { truckDriverProfiles, count } = action.payload;
			truckDriversAdapter.setAll(state, truckDriverProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			truckDriversAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					truckDriversAdapter.updateOne(state, {
						id: item.user_id,
						changes: { app_version: item.app_version }
					});
				});
			}
		}
	}
});

export const { setParams } = truckDriversSlice.actions;
export default truckDriversSlice.reducer;
