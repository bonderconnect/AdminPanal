import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiServicesAnalytics from 'app/services/apiServices/analytics';

export const getVideosWatch = createAsyncThunk(
	'analyticsApp/videosWatch/getVideosWatch',
	async (__, { dispatch, getState }) => {
		const state = getState();
		const { params } = state.analyticsApp.videosWatch;
		const getVideosWatchRes = await apiServicesAnalytics.getVideosWatch({
			params
		});

		const { data } = getVideosWatchRes.data;
		const videosWatch = data && data.videos_watch;
		const meta = data.page;
		dispatch(setMeta(meta));
		return videosWatch;
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
const videosWatchSlice = createSlice({
	name: 'analyticsApp/videosWatch',
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
		[getVideosWatch.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getVideosWatch.pending]: state => {
			state.list.loading = true;
		}
	}
});

export const { setMeta, setParams } = videosWatchSlice.actions;
export default videosWatchSlice.reducer;
