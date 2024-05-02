import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as videoApi from 'app/services/apiServices/video';

export const getVideoWatchLogsOfAllUsers = createAsyncThunk(
	'liveEvent/recordings/video/watchLogs/getVideoWatchLogsOfAllUsers',
	async (learningMaterialId, { getState, dispatch }) => {
		const state = getState();
		const { params } = state.liveEventApp.recordings.video.watchLogs;
		const result = await videoApi.getVideoWatchLogsOfAllUsers({
			params,
			urlParams: {
				learningMaterialId
			}
		});

		const data = result.data && result.data.data;
		const learningMaterialVideoWatchLogsOfAllUsers = data.learning_material_video_watch_logs_of_all_users;
		const meta = data.page;
		dispatch(setMeta(meta));
		return learningMaterialVideoWatchLogsOfAllUsers;
	}
);

const initialState = {
	params: {
		page: 1,
		limit: 10,
		search: ''
	},
	list: {
		loading: true,
		data: null
	},
	meta: {}
};

const videoWatchLogsSlice = createSlice({
	name: 'liveEvent/recordings/video/watchLogs',
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
		[getVideoWatchLogsOfAllUsers.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getVideoWatchLogsOfAllUsers.pending]: state => {
			state.list.loading = true;
		}
	}
});

export const { reset, setMeta, setParams } = videoWatchLogsSlice.actions;
export default videoWatchLogsSlice.reducer;
