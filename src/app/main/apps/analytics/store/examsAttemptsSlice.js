import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiServicesAnalytics from 'app/services/apiServices/analytics';

export const getExamsAttempts = createAsyncThunk(
	'analyticsApp/examsAttempts/getExamsAttempts',
	async (__, { dispatch, getState }) => {
		const state = getState();
		const { params } = state.analyticsApp.examsAttempts;
		const getExamsAttemptsRes = await apiServicesAnalytics.getExamAttempts({
			params
		});

		const { data } = getExamsAttemptsRes.data;
		const examsAttempts = data && data.exams_attended;
		const meta = data.page;
		dispatch(setMeta(meta));
		return examsAttempts;
	}
);

const initialState = {
	params: {
		page: 1,
		limit: 10,
		sort_dir: 'desc',
		search: ''
	},
	list: {
		loading: true,
		data: null
	},
	meta: {}
};
const examAttemptsSlice = createSlice({
	name: 'analyticsApp/examAttempts',
	initialState,
	reducers: {
		setMeta: (state, action) => {
			state.meta = action.payload;
		},
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getExamsAttempts.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getExamsAttempts.pending]: state => {
			state.list.loading = true;
		}
	}
});

export const { setMeta, setParams } = examAttemptsSlice.actions;
export default examAttemptsSlice.reducer;
