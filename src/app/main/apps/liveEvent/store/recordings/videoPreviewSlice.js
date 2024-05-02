import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import { showMessage } from 'app/store/fuse/messageSlice';
// eslint-disable-next-line import/no-cycle
import { getVideos, setItemsStatusInChangeProgress } from './videosSlice';

export const openVideoPreview = createAsyncThunk(
	'liveEvent/recordings/videoPreview/openVideoPreview',
	async materialId => {
		const response = await axios
			.get(`/learning-material/video/${materialId}`)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse));
		const data = await response.data;
		return data;
	}
);

const videoPreviewSlice = createSlice({
	name: 'liveEvent/recordings/video',
	initialState: {
		video: null,
		loading: false,
		dialogue: {
			props: {
				open: false
			}
		}
	},
	reducers: {
		closeVideoPreview: state => {
			state.dialogue.props.open = false;
		}
	},
	extraReducers: {
		[openVideoPreview.pending]: () => {
			const state = {
				video: null,
				loading: true,
				dialogue: {
					props: {
						open: true
					}
				}
			};
			return state;
		},
		[openVideoPreview.fulfilled]: (state, action) => {
			state.video = action.payload;
			state.loading = false;
		}
	}
});

export const { closeVideoPreview } = videoPreviewSlice.actions;
export default videoPreviewSlice.reducer;
