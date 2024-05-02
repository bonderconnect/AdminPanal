import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getAgents = createAsyncThunk('agentsApp/agents/getAgents', async (params, { dispatch, getState }) => {
	params = params || getState().agentsApp.agents.params;
	const response = await axios
		.get('/users/agent-profiles', { params })
		.then(axiosResponse => helpers.parseApiResponseV2(axiosResponse));
	const loading = false;
	const { agentProfiles } = response.data;

	const count = response.data._meta.total_count;
	return { agentProfiles, count, params, loading };
});

export const getUsersLatestAppVersion = createAsyncThunk('usersApp/users/getUsersLatestAppVersion', async userIds => {
	const result = await apiServicesUser.getUsersLatestAppVersionAgainstUserIds({ data: { user_ids: userIds } });
	return result.data;
});

const agentsAdapter = createEntityAdapter({ selectId: entity => entity['user.user_id'] });
export const { selectAll: selectAgents } = agentsAdapter.getSelectors(state => state.agentsApp.agents);

const initialState = {
	params: {
		page: 1,
		limit: 10
	},
	meta: {
		totalCount: null
	},
	loading: false
};

const agentsSlice = createSlice({
	name: 'agentsApp/agents',
	initialState: agentsAdapter.getInitialState(initialState),
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		}
	},
	extraReducers: {
		[getAgents.pending]: state => {
			state.loading = true;
		},
		[getAgents.rejected]: state => {
			state.loading = false;
		},
		[getAgents.fulfilled]: (state, action) => {
			const { agentProfiles, count } = action.payload;
			agentsAdapter.setAll(state, agentProfiles);
			state.meta.totalCount = count;
			state.loading = false;
		},
		[getUsersLatestAppVersion.fulfilled]: (state, action) => {
			const userIdsInRequest = action.meta.arg;
			const data = action.payload;
			const updates = userIdsInRequest.map(userId => ({ id: userId, changes: { app_version: null } }));
			agentsAdapter.updateMany(state, updates);

			if (Array.isArray(data)) {
				data.forEach(item => {
					agentsAdapter.updateOne(state, { id: item.user_id, changes: { app_version: item.app_version } });
				});
			}
		}
	}
});

export const { setParams } = agentsSlice.actions;
export default agentsSlice.reducer;
