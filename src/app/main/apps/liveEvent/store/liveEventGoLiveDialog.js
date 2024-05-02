import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';

export const submitNewLiveEventGoLive = createAsyncThunk(
	'liveEvent/liveEventGoLiveDialog/submitNewLiveEventGoLive',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { liveEventId } = getState().liveEventApp.liveEventDialog.data;
		const { form } = payload;
		if (form.live_platform === 'zoom') {
			await axios.post(`/live-event/${liveEventId}/zoom`, { zoom_meeting_link: form.zoom_meeting_link });
		} else if (form.live_platform === 'youtube') {
			await axios.post(`/live-event/${liveEventId}/youtube`, { youtube_live_link: form.youtube_video_link });
		}
		await axios.post(`/live-event/${liveEventId}/set-is-live`, { is_on_live: true });
		if (payload.callback) {
			payload.callback();
		}
	}
);

export const submitEditLiveEventGoLive = createAsyncThunk(
	'liveEvent/liveEventGoLiveDialog/submitEditLiveEventGoLive',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const state = getState();
		const { liveEventId } = state.liveEventApp.liveEventDialog.data;
		const { form: previousForm } = state.liveEventApp.liveEventGoLiveDialog;
		const { form } = payload;
		const promises = [];

		if (form.live_platform === 'zoom' && form.live_platform !== previousForm.live_platform) {
			promises.push([
				axios.delete(`/live-event/${liveEventId}/youtube`),
				axios.post(`/live-event/${liveEventId}/zoom`, { zoom_meeting_link: form.zoom_meeting_link })
			]);
		} else if (form.live_platform === 'youtube' && form.live_platform !== previousForm.live_platform) {
			promises.push([
				axios.delete(`/live-event/${liveEventId}/zoom`),
				axios.post(`/live-event/${liveEventId}/youtube`, { youtube_live_link: form.youtube_video_link })
			]);
		} else if (form.live_platform === 'zoom') {
			promises.push([
				axios.patch(`/live-event/${liveEventId}/zoom`, { zoom_meeting_link: form.zoom_meeting_link })
			]);
		} else if (form.live_platform === 'youtube') {
			promises.push([
				axios.patch(`/live-event/${liveEventId}/youtube`, { youtube_live_link: form.youtube_video_link })
			]);
		}

		await Promise.all(promises);

		if (payload.callback) {
			payload.callback();
		}
	}
);

export const openEditLiveEventGoLiveDialog = createAsyncThunk(
	'liveEvent/liveEventGoLiveDialog/openNewLiveEventGoLiveDialog',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { liveEventId } = getState().liveEventApp.liveEventDialog.data;
		const getLiveEventResponse = await axios.get(`/live-event/${liveEventId}`);
		const liveEvent = getLiveEventResponse.data.data;
		console.log('liveEvent:', liveEvent);
		const form = {};
		if (liveEvent.youtube_live_link) {
			form.live_platform = 'youtube';
			form.youtube_video_link = liveEvent.youtube_live_link;
		} else if (liveEvent.zoom_meeting_url) {
			form.live_platform = 'zoom';
			form.zoom_meeting_link = liveEvent.zoom_meeting_url;
		} else {
			// zoom select as default
			form.live_platform = 'zoom';
		}
		return { form, isOnLiveValue: liveEvent.is_on_live };
	}
);

export const stopLive = createAsyncThunk(
	'liveEvent/liveEventGoLiveDialog/stopLive',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { liveEventId } = getState().liveEventApp.liveEventDialog.data;
		const getLiveEventResponse = await axios.post(`/live-event/${liveEventId}/set-is-live`, { is_on_live: false });
		return null;
	}
);

export const goLive = createAsyncThunk(
	'liveEvent/liveEventGoLiveDialog/goLive',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { liveEventId } = getState().liveEventApp.liveEventDialog.data;
		const getLiveEventResponse = await axios.post(`/live-event/${liveEventId}/set-is-live`, { is_on_live: true });
		return null;
	}
);

const initialState = {
	open: false,
	type: 'new',
	form: {},
	data: {},
	submitting: false,
	errors: null,
	loading: false
};

const liveEventDialogueSlice = createSlice({
	name: 'liveEvent/liveEventGoLiveDialog',
	initialState,
	reducers: {
		openNewLiveEventGoLiveDialog: (state, action) => {
			state = { ...initialState, type: 'new', open: true, data: { ...state.data, liveEventId: action.payload } };
			return state;
		},
		closeDialog: state => {
			state.open = false;
		}
	},
	extraReducers: {
		[submitNewLiveEventGoLive.pending]: state => {
			state.submitting = true;
		},
		[submitNewLiveEventGoLive.fulfilled]: state => {
			state.open = false;
		},
		[openEditLiveEventGoLiveDialog.pending]: state => {
			state = { ...initialState };
			state.type = 'edit';
			state.open = true;
			state.loading = true;
			return state;
		},
		[openEditLiveEventGoLiveDialog.fulfilled]: (state, action) => {
			const { form, isOnLiveValue } = action.payload;
			state.form = form;
			state.data.isOnLiveValue = isOnLiveValue;
			state.loading = false;
		},
		[submitEditLiveEventGoLive.pending]: state => {
			state.submitting = true;
		},
		[submitEditLiveEventGoLive.fulfilled]: state => {
			state.open = false;
		}
	}
});

export const { openNewLiveEventGoLiveDialog, closeDialog } = liveEventDialogueSlice.actions;
export default liveEventDialogueSlice.reducer;
