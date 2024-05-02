import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getServices = createAsyncThunk(
	'servicesApp/services/getServices',
	async (params, { dispatch, getState }) => {
		params = params || getState().servicesApp.services.params;
		const response = await axios
			.get('/service-products-with-company-profile', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { products: services } = response.data;

		const count = response.data._meta.total_count;
		return { services, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const servicesAdapter = createEntityAdapter({ selectId: entity => entity.product_id });
export const { selectAll: selectServices } = servicesAdapter.getSelectors(state => state.servicesApp.services);

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

const servicesSlice = createSlice({
	name: 'servicesApp/services',
	initialState: servicesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getServices.pending]: state => {
			state.loading = true;
		},
		[getServices.rejected]: state => {
			state.loading = false;
		},
		[getServices.fulfilled]: (state, action) => {
			const { services, count } = action.payload;
			servicesAdapter.setAll(state, services);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			servicesAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					servicesAdapter.updateOne(state, { id: item.user_id, changes: { app_version: item.app_version } });
				});
			}
		}
	}
});

export const { setParams } = servicesSlice.actions;
export default servicesSlice.reducer;
