import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';

export const getSchedules = createAsyncThunk('liveEvent/schedule/getSchedules', async payload => {
	const { startTime, endTime } = payload;
	const getStudentsResponse = await axios.get('/live-events', {
		params: { start_time: startTime, end_time: endTime }
	});
	const data = getStudentsResponse.data && getStudentsResponse.data.data;

	return data;
});

const liveEventSchedulesAdapter = createEntityAdapter({
	selectId: liveEventSchedule => liveEventSchedule.live_event_id
});

export const { selectAll: selectSchedules } = liveEventSchedulesAdapter.getSelectors(
	state => state.liveEventApp.schedules
);

const initialState = {
	loading: false
};

const scheduleSlice = createSlice({
	name: 'liveEvent/schedule',
	initialState: liveEventSchedulesAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
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

export default scheduleSlice.reducer;
