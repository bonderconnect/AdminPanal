import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getConstructionMaterialsCompanies = createAsyncThunk(
	'constructionMaterialsCompaniesApp/constructionMaterialsCompanies/getConstructionMaterialsCompanies',
	async (params, { dispatch, getState }) => {
		params = params || getState().constructionMaterialsCompaniesApp.constructionMaterialsCompanies.params;
		const response = await axios
			.get('/users/construction-materials-company-profiles', { params })
			.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
		const loading = false;
		const { constructionMaterialsCompanyProfiles } = response.data;

		const count = response.data._meta.total_count;
		return { constructionMaterialsCompanyProfiles, count, params, loading };
	}
);

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const constructionMaterialsCompaniesAdapter = createEntityAdapter({ selectId: entity => entity.user_id });
export const { selectAll: selectConstructionMaterialsCompanies } = constructionMaterialsCompaniesAdapter.getSelectors(
	state => state.constructionMaterialsCompaniesApp.constructionMaterialsCompanies
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

const constructionMaterialsCompaniesSlice = createSlice({
	name: 'constructionMaterialsCompaniesApp/constructionMaterialsCompanies',
	initialState: constructionMaterialsCompaniesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getConstructionMaterialsCompanies.pending]: state => {
			state.loading = true;
		},
		[getConstructionMaterialsCompanies.rejected]: state => {
			state.loading = false;
		},
		[getConstructionMaterialsCompanies.fulfilled]: (state, action) => {
			const { constructionMaterialsCompanyProfiles, count } = action.payload;
			constructionMaterialsCompaniesAdapter.setAll(state, constructionMaterialsCompanyProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			constructionMaterialsCompaniesAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					constructionMaterialsCompaniesAdapter.updateOne(state, {
						id: item.user_id,
						changes: { app_version: item.app_version }
					});
				});
			}
		}
	}
});

export const { setParams } = constructionMaterialsCompaniesSlice.actions;
export default constructionMaterialsCompaniesSlice.reducer;
