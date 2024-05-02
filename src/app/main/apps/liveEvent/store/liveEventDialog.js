import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const createLiveEvent = createAsyncThunk(
	'liveEvent/liveEventDialog/createLiveEvent',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		const createLiveEventData = {
			title: form.title,
			description: form.description,
			start_time: form.start_time,
			end_time: form.end_time,
			faculty_user_id: form.faculty_user_id,
			status: 'active'
		};
		const createLiveEventResponse = await axios.post('/live-event', createLiveEventData);
		const liveEventId = createLiveEventResponse.data.data.live_event_id;

		if (form.package_ids && form.package_ids.length) {
			const liveEventBindPackagesData = { package_ids: form.package_ids };
			await axios.post(`/live-event/${liveEventId}/bind-packages`, liveEventBindPackagesData);
		}

		axios.get(`/live-event/${liveEventId}/send-notifications`);

		if (payload.callback) {
			payload.callback();
		}
		return liveEventId;
	}
);

export const updateLiveEvent = createAsyncThunk(
	'liveEvent/liveEventDialog/updateLiveEvent',
	async (payload, { dispatch, getState, rejectWithValue }) => {
		const { form } = payload;
		const state = getState();
		const { liveEventId } = state.liveEventApp.liveEventDialog.data;
		const updateLiveEventData = {
			title: form.title,
			description: form.description,
			start_time: form.start_time,
			end_time: form.end_time,
			status: 'active',
			faculty_user_id: form.faculty_user_id
		};

		const promises = [axios.patch(`/live-event/${liveEventId}`, updateLiveEventData)];
		const previousPackageIds = state.liveEventApp.liveEventDialog.form.package_ids;
		const packageIdsToUnbind = previousPackageIds.filter(item => form.package_ids.indexOf(item) === -1);
		const packageIdsToBind = form.package_ids.filter(item => previousPackageIds.indexOf(item) === -1);

		if (packageIdsToBind.length) {
			const liveEventBindPackagesData = { package_ids: packageIdsToBind };
			promises.push(axios.post(`/live-event/${liveEventId}/bind-packages`, liveEventBindPackagesData));

			// send notitications to users
		}

		if (packageIdsToUnbind.length) {
			const liveEventUnbindPackagesData = { package_ids: packageIdsToUnbind };
			promises.push(axios.post(`/live-event/${liveEventId}/unbind-packages`, liveEventUnbindPackagesData));

			// Delete app persist notifiations from unbinded packaged users
		}

		// const previousStartTime = state.liveEventApp.liveEventDialog.form.start_time;
		// const previousEndTime = state.liveEventApp.liveEventDialog.form.end_time;
		// if (previousStartTime !== form.start_time || previousEndTime !== form.end_time) {
		// 	// send live event time change / update notifications
		// }

		await Promise.all(promises);

		if (payload.callback) {
			payload.callback();
		}
		return null;
	}
);

export const openNewLiveEventDialog = createAsyncThunk('liveEvent/liveEventDialog/openNewLiveEventDialog', async () => {
	const getPackagesResponse = await axios.get('/packages', { params: { limit: -1 } });
	const packages = getPackagesResponse.data.data;

	return { packages };
});

export const deleteLiveEvent = createAsyncThunk('liveEvent/liveEventDialog/deleteLiveEvent', async payload => {
	await axios.delete(`/live-event/${payload.eventId}`);
	if (payload.callback) payload.callback();
	return null;
});

export const openEditLiveEventDialog = createAsyncThunk(
	'liveEvent/liveEventDialog/openEditLiveEventDialog',
	async eventId => {
		const [getLiveEventResponse, getPackagesResponse] = await Promise.all([
			axios.get(`/live-event/${eventId}`),
			axios.get('/packages', { params: { limit: -1 } })
		]);
		const liveEvent = getLiveEventResponse.data.data;
		const form = {
			title: liveEvent.title,
			description: liveEvent.description,
			start_time: liveEvent.start_time,
			end_time: liveEvent.end_time,
			package_ids: [],
			faculty_user_id: liveEvent.faculty_id
		};

		if (liveEvent.packages && liveEvent.packages.length) {
			liveEvent.packages.forEach(item => {
				form.package_ids.push(item.package_id);
			});
		}

		const packages = getPackagesResponse.data.data;
		return { form, packages, isOnLiveValue: liveEvent.is_on_live };
	}
);

const initialState = {
	type: 'new',
	open: false,
	form: {},
	data: {},
	submitting: false,
	errors: null,
	loading: false,
	deleteting: false
};

const liveEventDialogueSlice = createSlice({
	name: 'liveEvent/liveEventDialog',
	initialState,
	reducers: {
		closeDialog: state => {
			state.open = false;
		}
	},
	extraReducers: {
		[openNewLiveEventDialog.pending]: state => {
			state = { ...initialState };
			state.type = 'new';
			state.open = true;
			state.loading = true;
			state.submitting = false;
			return state;
		},
		[openNewLiveEventDialog.fulfilled]: (state, action) => {
			const { packages } = action.payload;
			state.loading = false;
			state.data = { packages };
			return state;
		},
		[createLiveEvent.pending]: (state, action) => {
			state.submitting = true;
		},
		[createLiveEvent.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[createLiveEvent.fulfilled]: (state, action) => {
			state.open = false;
		},
		[openEditLiveEventDialog.pending]: (state, action) => {
			const liveEventId = action.meta.arg;
			state.type = 'edit';
			state.open = true;
			state.loading = true;
			state.submitting = false;
			state.data = { liveEventId };
		},
		[openEditLiveEventDialog.fulfilled]: (state, action) => {
			const { form, packages, isOnLiveValue } = action.payload;
			state.form = form;
			state.data.packages = packages;
			state.data.isOnLiveValue = isOnLiveValue;
			state.loading = false;
		},
		[updateLiveEvent.rejected]: (state, action) => {
			if (action.payload && action.payload.errors) {
				state.errors = action.payload.errors;
			}
			state.submitting = false;
		},
		[updateLiveEvent.pending]: state => {
			state.submitting = true;
		},
		[updateLiveEvent.fulfilled]: state => {
			state.submitting = true;
			state.open = false;
		},
		[deleteLiveEvent.pending]: state => {
			state.deleting = true;
		},
		[deleteLiveEvent.fulfilled]: state => {
			state.deleting = false;
		}
	}
});

export const { closeDialog } = liveEventDialogueSlice.actions;

export default liveEventDialogueSlice.reducer;
