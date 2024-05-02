import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getFilterPackages = createAsyncThunk('usersApp/filter/getPackages', async () => {
	const response = await axios
		.get('/users/filter/packages')
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const data = await response.data;
	return { data };
});

const filtersSlice = createSlice({
	name: 'usersApp/filters',
	initialState: {
		statuses: {
			items: [
				{ label: 'Active', value: 1 },
				{ label: 'Suspended / Inactive', value: 0 }
			]
		},
		packages: {
			items: null
		}
	},
	reducers: {},
	extraReducers: {
		[getFilterPackages.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.packages.items = data;
		}
	}
});

export default filtersSlice.reducer;
