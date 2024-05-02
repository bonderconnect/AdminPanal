import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';

export const getFaculties = createAsyncThunk(
	'facultiesApp/faculties/getFaculties',
	async (params, { dispatch, getState }) => {
		params = params || getState().facultiesApp.faculties.params;
		const getFacultiesResponse = await axios.get('/faculties', { params });
		const data = getFacultiesResponse.data && getFacultiesResponse.data.data;

		return data;
	}
);

const facultiesAdapter = createEntityAdapter({});
export const { selectAll: selectFaculties } = facultiesAdapter.getSelectors(state => state.facultiesApp.faculties);

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

const facultiesSlice = createSlice({
	name: 'facultiesApp/faculties',
	initialState: facultiesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getFaculties.pending]: state => {
			state.loading = true;
		},
		[getFaculties.rejected]: state => {
			state.loading = false;
		},
		[getFaculties.fulfilled]: (state, action) => {
			const { faculties, _meta } = action.payload;
			facultiesAdapter.setAll(state, faculties);
			state.meta.totalCount = _meta.total_count;
			state.loading = false;
		}
	}
});

export const { setParams } = facultiesSlice.actions;
export default facultiesSlice.reducer;
