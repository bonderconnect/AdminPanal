import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getCategoryTypes = createAsyncThunk(
	'categoriesApp/categoryTypes/getCategoryTypes',
	async (_, { getState }) => {
		const response = await axios
			.get('/category-types')
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
		const { data } = response;

		return data;
	}
);

export const addCategoryType = createAsyncThunk(
	'categoriesApp/categoryTypes/addCategoryType',
	async (payload, { dispatch }) => {
		const categoryType = payload.addCategoryTypePayload;
		return axios
			.post('/category-type', categoryType)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
			.then(() => {
				dispatch(showMessage({ message: 'Category Type added successfully' }));
				dispatch(getCategoryTypes());
			})
			.finally(() => {
				if (payload.closeNewCategoryTypeDialog) {
					dispatch(closeNewCategoryTypeDialogue());
				}
			});
	}
);

export const deleteCategoryType = createAsyncThunk(
	'categoriesApp/categoryTypes/deleteCategoryType',
	async (categoryTypeId, { dispatch }) => {
		return axios
			.delete(`/category-type/${categoryTypeId}`)
			.then(helpers.parseApiResponse, helpers.parseApiResponse)
			.then(result => {
				if (result.error) {
					dispatch(showMessage({ message: result.error }));
				} else {
					dispatch(showMessage({ message: 'Category type deleted successfully' }));
				}
			})
			.finally(() => dispatch(getCategoryTypes()));
	}
);

export const updateCategoryType = createAsyncThunk(
	'categoriesApp/categoryTypes/updateCategoryType',
	async (payload, { dispatch }) => {
		const categoryType = payload.updateCategoryTypePayload;
		const { categoryTypeId } = payload;
		return axios
			.patch(`/category-type/${categoryTypeId}`, categoryType)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
			.then(() => {
				dispatch(showMessage({ message: 'Category Type updated successfully' }));
				dispatch(getCategoryTypes());
			})
			.finally(() => {
				if (payload.closeEditCategoryTypeDialog) {
					dispatch(closeEditCategoryTypeDialogue());
				}
			});
	}
);

export const addCategories = null;

const categoryTypesAdapter = createEntityAdapter({ selectId: categoryType => categoryType.type_id });

export const { selectAll: selectCategoryTypes } = categoryTypesAdapter.getSelectors(
	state => state.categoriesApp.categoryTypes
);

const categoriesSlice = createSlice({
	name: 'categoriesApp/categoryTypes',
	initialState: categoryTypesAdapter.getInitialState({
		categoryTypeDialogue: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			submitting: false
		}
	}),
	reducers: {
		openNewCategoryTypeDialogue: state => {
			state.categoryTypeDialogue.props.open = true;
			state.categoryTypeDialogue.type = 'new';
			state.categoryTypeDialogue.data = null;
		},
		openEditCategoryTypeDialogue: (state, action) => {
			state.categoryTypeDialogue.props.open = true;
			state.categoryTypeDialogue.type = 'edit';
			state.categoryTypeDialogue.data = action.payload;
		},
		closeNewCategoryTypeDialogue: state => {
			state.categoryTypeDialogue.props.open = false;
		},
		closeEditCategoryTypeDialogue: state => {
			state.categoryTypeDialogue.props.open = false;
		}
	},
	extraReducers: {
		[getCategoryTypes.fulfilled]: categoryTypesAdapter.setAll,
		[addCategoryType.pending]: state => {
			state.categoryTypeDialogue.submitting = true;
		},
		[deleteCategoryType.pending]: (state, action) => {
			categoryTypesAdapter.removeOne(state, action.meta.arg);
		}
	}
});

export const {
	openNewCategoryTypeDialogue,
	closeNewCategoryTypeDialogue,
	closeEditCategoryTypeDialogue,
	openEditCategoryTypeDialogue
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
