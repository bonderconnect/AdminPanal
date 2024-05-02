import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getCategories = createAsyncThunk('liveEvent/recordings/categories/getCategories', async () => {
	const response = await axios
		.get('/categories')
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const responseData = await response.data;

	const data = responseData.length ? responseData.map(item => ({ ...item, id: item.category_id })) : responseData;
	return data;
});

const categoriesAdapter = createEntityAdapter({});

export const { selectAll: selectCategories, selectById: selectCategoryById } = categoriesAdapter.getSelectors(
	state => state.liveEventApp.recordings.categories
);

const categoriesSlice = createSlice({
	name: 'liveEvent/recordings/categories',
	initialState: categoriesAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getCategories.fulfilled]: categoriesAdapter.setAll
	}
});

export default categoriesSlice.reducer;
