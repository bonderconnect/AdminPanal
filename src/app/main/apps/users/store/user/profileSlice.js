import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/user';

export const getUserProfileData = createAsyncThunk(
	'usersApp/user/getUserProfileData',
	async (userId, { dispatch, getState }) => {
		const getUserResult = await apiServicesUser.getUser({
			urlParams: {
				userId
			}
		});
		const user = getUserResult.data;
		// Deleting unwanted prop from api;
		delete user.data;
		return user;
	}
);

const initialState = {
	loading: true,
	data: null
};

const userSlice = createSlice({
	name: 'usersApp/user/profile',
	initialState,
	reducers: {
		resetProfile: () => {
			return initialState;
		}
	},
	extraReducers: {
		[getUserProfileData.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.loading = false;
		}
	}
});

export const { resetProfile } = userSlice.actions;
export default userSlice.reducer;
