import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getVideosWatchLog = createAsyncThunk(
	'usersApp/user/analytics/videos/getVideosWatchLog',
	async (userId, { dispatch, getState }) => {
		const state = getState();
		const { params } = state.usersApp.user.analytics.videos;
		const result = await apiServicesUser.getUserVideoWatchLogs({
			params,
			urlParams: {
				userId
			}
		});

		const data = result.data && result.data.data;
		const learningMaterialVideoWatchLogs = data.learning_material_video_watch_logs;
		const meta = data.page;
		dispatch(setMeta(meta));
		return learningMaterialVideoWatchLogs;
	}
);

export const getDistinctVideoWatchCount = createAsyncThunk(
	'usersApp/agent/analytics/videos/getDistinctVideoWatchCount',
	async userId => {
		const result = await apiServicesUser.getUserDistinctVideoWatchCount({
			urlParams: {
				userId
			}
		});
		const count = (result.data && result.data.data) || 0;
		return count;
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
	meta: {},
	distinctVideoWatchCount: null
};

const userAnalyticsVideosSlice = createSlice({
	name: 'usersApp/user/analytics/videos',
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
		[getVideosWatchLog.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getVideosWatchLog.pending]: state => {
			state.list.loading = true;
		},
		[getDistinctVideoWatchCount.fulfilled]: (state, action) => {
			state.distinctVideoWatchCount = action.payload;
		}
	}
});

export const { reset, setMeta, setParams } = userAnalyticsVideosSlice.actions;
export default userAnalyticsVideosSlice.reducer;
