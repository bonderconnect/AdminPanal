import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/agent';

export const getAgentProfileData = createAsyncThunk(
	'agentsApp/agent/getAgentProfileData',
	async (userId, { dispatch, getState }) => {
		const getAgentResult = await apiServicesUser.getAgentProfile({
			urlParams: {
				userId
			}
		});
		const agent = getAgentResult.data;
		// Deleting unwanted prop from api;
		// delete agent.data;
		return agent;
	}
);

const initialState = {
	loading: false,
	data: null,
	error: null
};

const agentSlice = createSlice({
	name: 'agentsApp/agent/profile1',
	initialState,
	reducers: {
		resetProfile: () => {
			return initialState;
		}
	},
	extraReducers: {
		[getAgentProfileData.pending]: (state, action) => {
			state.loading = true;
		},
		[getAgentProfileData.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.loading = false;
		},
		[getAgentProfileData.rejected]: (state, action) => {
			state.error = action.error;
			state.loading = false;
		}
	}
});

export const { resetProfile } = agentSlice.actions;
export default agentSlice.reducer;
