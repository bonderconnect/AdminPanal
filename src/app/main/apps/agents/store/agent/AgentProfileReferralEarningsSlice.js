import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/agent';

export const getAgentProfileReferralEarnings = createAsyncThunk(
	'agentsApp/agent/getAgentProfileReferralEarnings',
	async (userId, { dispatch, getState }) => {
		const response = await apiServicesUser.getAgentProfileReferralEarnings({
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

const earningsSlice = createSlice({
	name: 'agentsApp/agent/referralEarnings',
	initialState,
	reducers: {
		resetReferralEarnings: () => initialState
	},
	extraReducers: {
		[getAgentProfileReferralEarnings.pending]: state => {
			state.loading = true;
		},
		[getAgentProfileReferralEarnings.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.loading = false;
		},
		[getAgentProfileReferralEarnings.rejected]: (state, action) => {
			state.error = action.error;
			state.loading = false;
		}
	}
});

export const { resetReferralEarnings } = earningsSlice.actions;

export default earningsSlice.reducer;
