import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';

export const getSchedules = createAsyncThunk(
	'liveEvent/schedule/calendar/getSchedules',
	async (payload, { getState }) => {
		let startTime;
		let endTime;
		if (payload) {
			startTime = payload.startTime;
			endTime = payload.endTime;
		} else {
			const state = getState();
			startTime = state.liveEventApp.schedule.calendar.dateRange.start;
			endTime = state.liveEventApp.schedule.calendar.dateRange.end;
		}
		const getLiveEventsResponse = await axios.get('/live-events', {
			params: { start_time: startTime, end_time: endTime }
		});
		const data = getLiveEventsResponse.data && getLiveEventsResponse.data.data;

		return data;
	}
);

const liveEventSchedulesAdapter = createEntityAdapter({
	selectId: liveEventSchedule => liveEventSchedule.live_event_id
});

export const { selectAll: selectEvents } = liveEventSchedulesAdapter.getSelectors(
	state => state.liveEventApp.schedule.calendar
);

const initialState = {
	loading: false,
	dateRange: null
};

const scheduleCalendarSlice = createSlice({
	name: 'liveEvent/schedule/calendar',
	initialState: liveEventSchedulesAdapter.getInitialState(initialState),
	reducers: {
		setDateRange: (state, action) => {
			state.dateRange = action.payload;
		}
	},
	extraReducers: {
		[getSchedules.pending]: state => {
			state.loading = true;
		},
		[getSchedules.fulfilled]: (state, action) => {
			const schedules = action.payload;
			liveEventSchedulesAdapter.setAll(state, schedules);
			state.loading = false;
		}
	}
});

export const { setDateRange } = scheduleCalendarSlice.actions;
export default scheduleCalendarSlice.reducer;
