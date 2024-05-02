import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getProducts = createAsyncThunk(
	'productsApp/products/getProducts',
	async (params, { dispatch, getState }) => {
		params = params || getState().productsApp.products.params;
		const response = await axios
			.get('/construction-materials-products-with-company-profile', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { products } = response.data;

		const count = response.data._meta.total_count;
		return { products, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const productsAdapter = createEntityAdapter({ selectId: entity => entity.product_id });
export const { selectAll: selectProducts } = productsAdapter.getSelectors(state => state.productsApp.products);

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

const productsSlice = createSlice({
	name: 'productsApp/products',
	initialState: productsAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getProducts.pending]: state => {
			state.loading = true;
		},
		[getProducts.rejected]: state => {
			state.loading = false;
		},
		[getProducts.fulfilled]: (state, action) => {
			const { products, count } = action.payload;
			productsAdapter.setAll(state, products);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			productsAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					productsAdapter.updateOne(state, { id: item.user_id, changes: { app_version: item.app_version } });
				});
			}
		}
	}
});

export const { setParams } = productsSlice.actions;
export default productsSlice.reducer;
