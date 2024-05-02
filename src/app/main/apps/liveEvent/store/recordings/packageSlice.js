import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getPackages = createAsyncThunk('liveEvent/recordings/packages/getPackages', async () => {
	const response = await axios
		.get('/packages', { params: { status_value: 1, limit: -1 } })
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const responseData = await response.data;

	const data = responseData.length ? responseData.map(item => ({ ...item, id: item.package_id })) : responseData;
	return data;
});

const packagesAdapter = createEntityAdapter({});

export const { selectAll: selectPackages, selectById: selectPackageById } = packagesAdapter.getSelectors(
	state => state.liveEventApp.recordings.packages
);

const packagesSlice = createSlice({
	name: 'liveEvent/recordings/packages',
	initialState: packagesAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getPackages.fulfilled]: packagesAdapter.setAll
	}
});

export default packagesSlice.reducer;
