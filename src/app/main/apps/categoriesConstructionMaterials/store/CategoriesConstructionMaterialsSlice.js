import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';

export const getCategoriesConstructionMaterials = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/getCategoriesByCompanyProfileTypes',
	async (profileTypes, { rejectWithValue }) => {
		try {
			const requestData = {
				profile_types: profileTypes
			};
			const response = await axios.post('/get-categories-by-profile-types', requestData);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
export const updateCategoriesConstructionMaterials = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/updateCategoriesConstructionMaterials',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post('/update-categories-products', data);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
export const deleteCategoriesConstructionMaterials = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/deleteCategoriesConstructionMaterials',
	// eslint-disable-next-line camelcase
	async (product_id, { rejectWithValue }) => {
		try {
			const response = await axios.post('/delete-categories-products', { product_id });
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
export const uploadFile = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/s3Uploader/uploadFile',
	async (payload, { getState, dispatch }) => {
		try {
			dispatch(uploadFilePending());
			const { name, size, type, lastModifiedDate } = payload;
			const file = document.getElementById('raised-button-file').files[0];

			console.log(`🚀  payload:`, payload);
			const imageUploadS3PresignedUrl = await axios.request({
				url: '/image-upload-s3-presigned-url',
				method: 'GET',
				data: {
					key: file.name
				}
			});
			console.log(`🚀  imageUploadS3PresignedUrl:`, imageUploadS3PresignedUrl);

			const imageUploadS3PresignedUrlData = imageUploadS3PresignedUrl?.data?.data;
			console.log('imageUploadS3PresignedUrlData', imageUploadS3PresignedUrlData);
			let fileKey;
			const fileUploadPayload = new FormData();
			Object.keys(imageUploadS3PresignedUrlData.fields).forEach(key => {
				if (key === 'key') {
					fileKey = imageUploadS3PresignedUrlData.fields[key];
					console.log(`🚀  Object.keys  fileKey:`, fileKey);
				}
				fileUploadPayload.append(key, imageUploadS3PresignedUrlData.fields[key]);
			});
			fileUploadPayload.append('file', file);

			axios
				.request({
					url: imageUploadS3PresignedUrlData.url,
					method: 'POST',
					data: fileUploadPayload,
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: ''
					}
				})
				.then(response => {
					console.log('response:', response);
				})
				.catch(error => {
					console.log('error', error);
				});

			const mediaPayload = { ...payload, file_key: fileKey };
			delete mediaPayload.file;
			delete mediaPayload.media_id;
			delete mediaPayload.priority;
			delete mediaPayload.url;
			delete mediaPayload.uri;
			delete mediaPayload.general;
			delete mediaPayload.lastModifiedDate;
			const createMediaResponse = await axios.post('/media', mediaPayload);
			const createdMediaData = createMediaResponse?.data?.data;
			console.log(`🚀  createdMediaData:`, createdMediaData?.media_id, payload?.priority);
			const newUploadUrl = `${imageUploadS3PresignedUrlData.url}/${fileKey}`;
			dispatch(setUploadUrl(newUploadUrl));
			dispatch(setMedia(createdMediaData?.media_id));
			dispatch(uploadFileSuccess());
			return {
				media_id: createdMediaData?.media_id,
				priority: payload?.priority
			};
		} catch (error) {
			console.error('Error caught:', error?.message);
			dispatch(uploadFileError(error?.message));
			return Promise.reject(error?.message);
		}
	}
);
export const addCategoriesConstructionMaterials = createAsyncThunk(
	'categoriesConstructionMaterials/addCategoriesConstructionMaterials',
	async (payload, { rejectWithValue }) => {
		try {
			console.log(`🚀  payload:`, payload.CategoriesConstructionMaterials);
			const response = await axios.request({
				url: '/insert-categories-product',
				method: 'POST',
				data: {
					name: payload.CategoriesConstructionMaterials.name,
					description: payload.CategoriesConstructionMaterials.description,
					status: payload.CategoriesConstructionMaterials.status,
					category_id: payload.CategoriesConstructionMaterials.category_id,
					media_id: payload.CategoriesConstructionMaterials.media_id
				}
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const categoriesConstructionMaterialsAdapter = createEntityAdapter({
	selectId: categoriesConstructionMaterials_ => categoriesConstructionMaterials_.CategoriesConstructionMaterials_id
});
export const {
	selectAll: selectAllCategoriesConstructionMaterials,
	selectById: selectCategoriesConstructionMaterialsById,
	selectEntities: selectCategoriesConstructionMaterialsEntities
} = categoriesConstructionMaterialsAdapter.getSelectors(
	state => state.categoriesConstructionMaterialsApp.CategoriesConstructionMaterials
);

const categoriesConstructionMaterialsSlice = createSlice({
	name: 'categoriesConstructionMaterialsApp/categoriesConstructionMaterials',

	initialState: categoriesConstructionMaterialsAdapter.getInitialState({
		selectedItemId: null,
		media_id: null,
		selectedItemDetail: null,
		categories: [],
		status: 'idle',
		selectedFile: null,
		uploadStatus: 'idle',
		uploadUrl: 'idle',
		error: null,
		count: null,
		params: {
			page: 1,
			limit: 10
		},
		categoriesConstructionMaterialsDialogue: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			submitting: false,
			errors: {}
		}
	}),
	reducers: {
		fileSelected: (state, action) => {
			// Create a new object without the lastModifiedDate property
			state.selectedFile = {
				...action.payload,
				lastModifiedDate: null // or remove this property if not needed
			};
		},
		setUploadUrl: (state, action) => {
			state.uploadUrl = action.payload;
		},
		setMedia: (state, action) => {
			state.media_id = action.payload;
		},
		resetUploadUrl: state => {
			state.uploadUrl = 'idle';
		},
		uploadFilePending: state => {
			state.uploadStatus = 'pending';
		},
		uploadFileSuccess: (state, action) => {
			state.uploadStatus = 'fulfilled';
		},
		uploadFileError: (state, action) => {
			state.uploadStatus = 'rejected';
			state.error = action.payload;
		},
		setSelectedItem: (state, action) => {
			state.selectedItemId = action.payload;
		},
		setParams: (state, action) => {
			state.params = action.payload;
		},
		closeEditCategoriesConstructionMaterialsDialog: state => {
			state.categoriesConstructionMaterialsDialogue.props.open = false;
		},
		closeNewCategoriesConstructionMaterialsDialog: state => {
			state.categoriesConstructionMaterialsDialogue.props.open = false;
		},
		openEditCategoriesConstructionMaterialsDialog: (state, action) => {
			const { payload } = action;
			state.categoriesConstructionMaterialsDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					product_id: payload.product_id,
					name: payload.name,
					description: payload.description,
					status: payload.status,
					image: payload.image_file_key,
					media_id: payload.media_id
				},
				submitting: false,
				errors: {}
			};
		},
		openNewCategoriesConstructionMaterialsDialog: state => {
			state.categoriesConstructionMaterialsDialogue.data = {};
			state.categoriesConstructionMaterialsDialogue.props.open = true;
			state.categoriesConstructionMaterialsDialogue.submitting = false;
			state.categoriesConstructionMaterialsDialogue.type = 'new';
		}
	},
	extraReducers: {
		[getCategoriesConstructionMaterials.pending]: state => {
			state.status = 'loading';
		},
		[getCategoriesConstructionMaterials.fulfilled]: (state, action) => {
			state.status = 'succeeded';
			state.categories = state.categories.concat(action.payload);
		},
		[getCategoriesConstructionMaterials.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
		[deleteCategoriesConstructionMaterials.pending]: state => {
			state.status = 'loading';
		},
		[deleteCategoriesConstructionMaterials.fulfilled]: (state, action) => {
			state.status = 'succeeded';
		},
		[deleteCategoriesConstructionMaterials.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
		[updateCategoriesConstructionMaterials.pending]: state => {
			state.categoriesConstructionMaterialsDialogue.submitting = true;
		},
		[updateCategoriesConstructionMaterials.fulfilled]: (state, action) => {
			state.categoriesConstructionMaterialsDialogue.submitting = false;
			state.categoriesConstructionMaterialsDialogue.props.open = false;
			showMessage({ message: 'Categories ConstructionMaterials Updated Successfully' });
		},
		[updateCategoriesConstructionMaterials.rejected]: (state, action) => {
			state.categoriesConstructionMaterialsDialogue.submitting = false;
			if (action.error.response && action.error.response.data) {
				state.categoriesConstructionMaterialsDialogue.errors = action.error.response.data.errors;
			} else {
				state.categoriesConstructionMaterialsDialogue.errors =
					'An error occurred while updating the categories.';
			}
		}
	}
});
export const {
	openNewCategoriesConstructionMaterialsDialog,
	openEditCategoriesConstructionMaterialsDialog,
	closeNewCategoriesConstructionMaterialsDialog,
	closeEditCategoriesConstructionMaterialsDialog,
	setParams,
	setSelectedItem,
	fileSelected,
	uploadFilePending,
	uploadFileSuccess,
	uploadFileError,
	setUploadUrl,
	resetUploadUrl,
	setMedia
} = categoriesConstructionMaterialsSlice.actions;

export default categoriesConstructionMaterialsSlice.reducer;
