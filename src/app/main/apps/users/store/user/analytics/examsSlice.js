import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getUserExamsAttended = createAsyncThunk(
	'usersApp/user/analytics/exams/getUserExamsAttended',
	async (userId, { dispatch, getState }) => {
		const state = getState();
		const { params } = state.usersApp.user.analytics.exams;
		const result = await apiServicesUser.getUserExamAttended({
			params,
			urlParams: {
				userId
			}
		});

		const data = result.data && result.data.data;
		const learningMaterialExamUserAttempts = data.learning_material_exam_user_attempts;
		const meta = data.page;
		dispatch(setMeta(meta));
		return learningMaterialExamUserAttempts;
	}
);

const initialState = {
	params: {
		page: 1,
		limit: 10
	},
	list: {
		loading: true,
		data: null
	},
	meta: {}
};

const userAnalyticsExamSlice = createSlice({
	name: 'usersApp/user/analytics/exams',
	initialState,
	reducers: {
		reset: () => {
			return initialState;
		},
		setMeta: (state, action) => {
			state.meta = action.payload;
		},
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getUserExamsAttended.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getUserExamsAttended.pending]: state => {
			state.list.loading = true;
		}
	}
});

export const { reset, setMeta, setParams } = userAnalyticsExamSlice.actions;
export default userAnalyticsExamSlice.reducer;
