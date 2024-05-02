import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/agent';

export const getAgentProfileReferrals = createAsyncThunk(
	'agentsApp/agent/getAgentProfileReferrals',
	async (userId, { dispatch, getState }) => {
		const response = await apiServicesUser.getAgentProfileReferrals({
			urlParams: {
				userId
			}
		});
		return response.data;
	}
);

const initialState = {
	loading: false,
	data: null,
	error: null
};

const referralsSlice = createSlice({
	name: 'agentsApp/agent/referrals',
	initialState,
	reducers: {
		resetReferrals: () => initialState
	},
	extraReducers: {
		[getAgentProfileReferrals.pending]: state => {
			state.loading = true;
		},
		[getAgentProfileReferrals.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.loading = false;
		},
		[getAgentProfileReferrals.rejected]: (state, action) => {
			state.error = action.error;
			state.loading = false;
		}
	}
});

export const { resetReferrals } = referralsSlice.actions;

export default referralsSlice.reducer;
