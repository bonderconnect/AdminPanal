import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getCategories = createAsyncThunk('categoriesApp/categories/getCategories', async (_, { getState }) => {
	const response = await axios
		.get('/categories')
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const { data } = response;

	return data;
});

export const addCategory = createAsyncThunk('categoriesApp/categories/addCategory', async (payload, { dispatch }) => {
	const { category } = payload;
	return axios
		.post('/category', category)
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
		.then(() => {
			dispatch(showMessage({ message: 'Category added successfully' }));
			dispatch(getCategories());
		})
		.finally(() => {
			if (payload.closeNewCategoryDialog) {
				dispatch(closeNewCategoryDialogue());
			}
		});
});

export const updateCategory = createAsyncThunk(
	'categoriesApp/categories/updateCategory',
	async (payload, { dispatch }) => {
		const { category, categoryId } = payload;
		return axios
			.patch(`/category/${categoryId}`, category)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
			.then(() => {
				dispatch(showMessage({ message: 'Category updated successfully' }));
				dispatch(getCategories());
			})
			.finally(() => {
				if (payload.closeEditCategoryDialogue) {
					dispatch(closeEditCategoryDialogue());
				}
			});
	}
);

export const deleteCategory = createAsyncThunk(
	'categoriesApp/categories/updateCategory',
	async (categoryId, { dispatch, getState }) => {
		return axios
			.delete(`/category/${categoryId}`)
			.then(helpers.parseApiResponse, helpers.parseApiResponse)
			.then(result => {
				if (result.error) {
					dispatch(showMessage({ message: result.error }));
				} else {
					dispatch(showMessage({ message: 'Category deleted successfully' }));
				}
			})
			.finally(() => dispatch(getCategories()));
	}
);

const categoriesAdapter = createEntityAdapter({ selectId: category => category.category_id });

export const { selectAll: selectCategories } = categoriesAdapter.getSelectors(state => state.categoriesApp.categories);

const categoriesSlice = createSlice({
	name: 'categoriesApp/categories',
	initialState: categoriesAdapter.getInitialState({
		categoryDialogue: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			submitting: false
		}
	}),
	reducers: {
		openNewCategoryDialogue: state => {
			state.categoryDialogue.props.open = true;
			state.categoryDialogue.type = 'new';
			state.categoryDialogue.data = null;
		},
		openEditCategoryDialogue: (state, action) => {
			state.categoryDialogue.props.open = true;
			state.categoryDialogue.type = 'edit';
			state.categoryDialogue.data = action.payload;
		},
		closeNewCategoryDialogue: state => {
			state.categoryDialogue.props.open = false;
		},
		closeEditCategoryDialogue: state => {
			state.categoryDialogue.props.open = false;
		}
	},
	extraReducers: {
		[getCategories.fulfilled]: categoriesAdapter.setAll,
		[deleteCategory.pending]: (state, action) => {
			categoriesAdapter.removeOne(state, action.meta.arg);
		}
	}
});

export const {
	openNewCategoryDialogue,
	closeNewCategoryDialogue,
	closeEditCategoryDialogue,
	openEditCategoryDialogue
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
