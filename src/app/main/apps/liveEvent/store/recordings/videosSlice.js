import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
// eslint-disable-next-line import/no-cycle

export const getVideos = createAsyncThunk(
	'liveEvent/recordings/videos/getVideos',
	async (params, { dispatch, getState }) => {
		params = params || getState().liveEventApp.recordings.videos.params;
		dispatch(getVideosCount(params));
		dispatch(setVideosParams(params));
		const response = await axios
			.get('/learning-material/videos', { params: { ...params, is_live_recording: 1 } })
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
		const responseData = await response.data;
		const data = responseData.length
			? responseData.map(item => ({ ...item, id: item.learning_material_id }))
			: responseData;
		const loading = false;
		return { data, loading };
	}
);

export const getVideosCount = createAsyncThunk(
	'liveEvent/recordings/videos/getVideosCount',
	async (params, { getState }) => {
		params = params || getState().liveEventApp.recordings.videos.params;
		const updatedParams = { ...params };
		delete updatedParams.page;
		delete updatedParams.limit;
		const response = await axios
			.get('/learning-material/videos/count', { params: { ...updatedParams, is_live_recording: 1 } })
			.then(helpers.parseApiResponse);
		const data = await response.data;

		return data;
	}
);

export const publishVideo = createAsyncThunk(
	'liveEvent/recordings/video/publishVideo',
	async (materialId, { dispatch }) => {
		dispatch(setItemsStatusInChangeProgress(materialId));
		const response = await axios.patch(`/learning-material/video/${materialId}/publish`);
		const data = await response.data;

		dispatch(showMessage({ message: 'Video published' }));
		return materialId;
	}
);

export const unpublishVideo = createAsyncThunk(
	'liveEvent/recordings/video/unpublishVideo',
	async (materialId, { dispatch }) => {
		dispatch(setItemsStatusInChangeProgress(materialId));
		const response = await axios.patch(`/learning-material/video/${materialId}/unpublish`);
		const data = await response.data;

		dispatch(showMessage({ message: 'Video unpublished' }));
		return materialId;
	}
);

export const removeVideo = createAsyncThunk(
	'liveEvent/recordings/video/removeVideo',
	async (materialId, { getState, dispatch }) => {
		await axios.delete(`/learning-material/${materialId}`);

		dispatch(showMessage({ message: 'Material Deleted' }));
		dispatch(getVideos());
	}
);

export const duplicateVideo = createAsyncThunk(
	'liveEvent/recordings/video/duplicateVideo',
	async (materialId, { dispatch }) => {
		dispatch(setItemsDuplicationInProgress(materialId));
		await axios.post(`/learning-material/${materialId}/duplicate`);

		dispatch(showMessage({ message: 'video duplicated successfully!' }));
		dispatch(getVideos());
	}
);

const videosAdapter = createEntityAdapter({});

export const { selectAll: selectVideos, selectById: selectVideoById } = videosAdapter.getSelectors(
	state => state.liveEventApp.recordings.videos
);

const videosSlice = createSlice({
	name: 'liveEvent/recordings/videos',
	initialState: videosAdapter.getInitialState({
		searchText: '',
		loading: false,
		params: {
			page: 1,
			limit: 10,
			sort_by: 'created_date',
			sort_dir: 'desc'
		},
		count: null,
		itemsStatusInChangeProgress: [], // To show progress in publishing / unpublishing,
		itemDuplicationInProgress: []
	}),
	reducers: {
		setVideosSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setVideosParams: (state, action) => {
			state.params = action.payload;
		},
		setVideosLoading: (state, action) => {
			state.loading = action.payload;
		},
		setVideosCount: (state, action) => {
			state.count = action.payload;
		},
		setItemsStatusInChangeProgress: (state, action) => {
			state.itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress, action.payload];
		},
		setItemsDuplicationInProgress: (state, action) => {
			state.itemDuplicationInProgress = [...state.itemDuplicationInProgress, action.payload];
		}
	},
	extraReducers: {
		[getVideos.pending]: (state, action) => {
			state.loading = true;
		},
		[getVideos.fulfilled]: (state, action) => {
			const { data, params, loading } = action.payload;
			videosAdapter.setAll(state, data);
			state.loading = loading;
			state.searchText = '';
		},
		[getVideosCount.fulfilled]: (state, action) => {
			state.count = action.payload;
		},
		[publishVideo.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			videosAdapter.updateOne(state, { id: materialId, changes: { status_value: 1 } });
		},
		[unpublishVideo.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			videosAdapter.updateOne(state, { id: materialId, changes: { status_value: 0 } });
		},
		[duplicateVideo.fulfilled]: (state, action) => {
			const itemDuplicationInProgress = [...state.itemDuplicationInProgress];
			const materialId = action.payload;
			const foundIndex = itemDuplicationInProgress.indexOf(materialId);
			itemDuplicationInProgress.splice(foundIndex, 1);
			state.itemDuplicationInProgress = itemDuplicationInProgress;
		}
	}
});

export const {
	setVideosParams,
	setVideosSearchText,
	setItemsStatusInChangeProgress,
	setItemsDuplicationInProgress
} = videosSlice.actions;

export default videosSlice.reducer;
