import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as videoApi from 'app/services/apiServices/video';

export const getVideo = createAsyncThunk('liveEvent/recordings/video/detail/getVideo', async learningMaterialId => {
	const videoResponse = await videoApi.getVideo({
		urlParams: {
			learningMaterialId
		}
	});

	const { data: video } = videoResponse;
	return video;
});

const initialState = {
	loading: true,
	data: null
};

const videoSlice = createSlice({
	name: 'liveEvent/recordings/video/detail',
	initialState,
	reducers: {
		reset: () => initialState
	},
	extraReducers: {
		[getVideo.fulfilled]: (state, action) => {
			state.loading = false;
			state.data = action.payload;
		}
	}
});
export const { reset } = videoSlice.actions;
export default videoSlice.reducer;
