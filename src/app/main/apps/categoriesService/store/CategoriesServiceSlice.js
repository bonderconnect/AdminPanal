import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';

export const getCategoriesService = createAsyncThunk(
	'categoriesServiceApp/categoriesService/getCategoriesByCompanyProfileTypes',
	async (profileTypes, { rejectWithValue }) => {
		try {
			const requestData = {
				profile_types: profileTypes
			};
			console.log(`🚀  requestData:`, requestData);
			const response = await axios.post('/get-categories-by-profile-types', requestData);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
export const updateCategoriesService = createAsyncThunk(
	'categoriesServiceApp/categoriesService/updateCategoriesService',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post('/update-categories', data);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
export const uploadFile = createAsyncThunk(
	'categoriesServiceApp/categoriesService/s3Uploader/uploadFile',
	async (payload, { getState, dispatch }) => {
		try {
			dispatch(uploadFilePending());
			const { name, size, type, lastModifiedDate } = payload;
			const file = document.getElementById('raised-button-file').files[0];

			const imageUploadS3PresignedUrl = await axios.request({
				url: '/image-upload-s3-presigned-url',
				method: 'GET',
				data: {
					key: file.name
				}
			});

			const imageUploadS3PresignedUrlData = imageUploadS3PresignedUrl?.data?.data;
			let fileKey;
			const fileUploadPayload = new FormData();
			Object.keys(imageUploadS3PresignedUrlData.fields).forEach(key => {
				if (key === 'key') {
					fileKey = imageUploadS3PresignedUrlData.fields[key];
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
export const deleteCategories = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/deleteCategoriesConstructionMaterials',
	// eslint-disable-next-line camelcase
	async (category_id, { rejectWithValue }) => {
		try {
			const response = await axios.post('/delete-categories', { category_id });
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
export const insertCategoriesService = createAsyncThunk(
	'categoriesConstructionMaterialsApp/categoriesConstructionMaterials/insertCategoriesConstructionMaterials',
	async (payload, { rejectWithValue }) => {
		try {
			const requestData = {
				company_profile_type: payload.company_profile_type,
				title: payload.category_title,
				description: payload.category_description,
				status: payload.status,
				media_id: payload.media_id,
				category_tag_id: payload.category_tag_id
			};
			console.log(`🚀  requestData:`, requestData);

			const response = await axios.post('/insert-categories', requestData);

			return response.payload;
		} catch (error) {
			return rejectWithValue(error.response.payload);
		}
	}
);

const categoriesServiceAdapter = createEntityAdapter({
	selectId: categoriesService_ => categoriesService_.CategoriesService_id
});
export const {
	selectAll: selectAllCategoriesService,
	selectById: selectCategoriesServiceById,
	selectEntities: selectCategoriesServiceEntities
} = categoriesServiceAdapter.getSelectors(state => state.categoriesServiceApp.CategoriesService);

const categoriesServiceSlice = createSlice({
	name: 'categoriesServiceApp/categoriesService',

	initialState: categoriesServiceAdapter.getInitialState({
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
		categoriesServiceDialogue: {
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
		closeEditCategoriesServiceDialog: state => {
			state.categoriesServiceDialogue.props.open = false;
		},
		closeNewCategoriesServiceDialog: state => {
			state.categoriesServiceDialogue.props.open = false;
		},
		openEditCategoriesServiceDialog: (state, action) => {
			const { payload } = action;
			state.categoriesServiceDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					category_id: payload.category_id,
					title: payload.category_title,
					category_description: payload.category_description,
					status_value: payload.status,
					image: payload.image,
					media_id: payload.media_id,
					company_profile_type: payload.company_profile_type
				},
				submitting: false,
				errors: {}
			};
		},
		openNewCategoriesServiceDialog: state => {
			state.categoriesServiceDialogue.data = {};
			state.categoriesServiceDialogue.props.open = true;
			state.categoriesServiceDialogue.submitting = false;
			state.categoriesServiceDialogue.type = 'new';
		}
	},
	extraReducers: {
		[getCategoriesService.pending]: state => {
			state.status = 'loading';
		},
		[getCategoriesService.fulfilled]: (state, action) => {
			state.status = 'succeeded';
			state.categories = state.categories.concat(action.payload);
		},
		[getCategoriesService.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
		[deleteCategories.pending]: state => {
			state.status = 'loading';
		},
		[deleteCategories.fulfilled]: (state, action) => {
			state.status = 'succeeded';
		},
		[deleteCategories.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
		[updateCategoriesService.pending]: state => {
			state.categoriesServiceDialogue.submitting = true;
		},
		[updateCategoriesService.fulfilled]: (state, action) => {
			state.categoriesServiceDialogue.submitting = false;
			state.categoriesServiceDialogue.props.open = false;
			showMessage({ message: 'Categories Service Updated Successfully' });
		},
		[updateCategoriesService.rejected]: (state, action) => {
			state.categoriesServiceDialogue.submitting = false;
			if (action.error.response && action.error.response.data) {
				state.categoriesServiceDialogue.errors = action.error.response.data.errors;
			} else {
				state.categoriesServiceDialogue.errors = 'An error occurred while updating the categories.';
			}
		},
		[insertCategoriesService.pending]: state => {
			state.categoriesServiceDialogue.submitting = true;
		},
		[insertCategoriesService.fulfilled]: (state, action) => {
			state.categoriesServiceDialogue.submitting = false;
			state.categoriesServiceDialogue.props.open = false;
			state.categoriesServiceDialogue.data = action.payload;
			showMessage({ message: 'Categories Service inserted  Successfully' });
		},
		[insertCategoriesService.rejected]: (state, action) => {
			state.categoriesServiceDialogue.submitting = false;
			if (action.error.response && action.error.response.data) {
				state.categoriesServiceDialogue.errors = action.error.response.data.errors;
			} else {
				state.categoriesServiceDialogue.errors = 'An error occurred while inserting the categories.';
			}
		}
	}
});
export const {
	openNewCategoriesServiceDialog,
	openEditCategoriesServiceDialog,
	closeNewCategoriesServiceDialog,
	closeEditCategoriesServiceDialog,
	setParams,
	setSelectedItem,
	fileSelected,
	uploadFilePending,
	uploadFileSuccess,
	uploadFileError,
	setUploadUrl,
	resetUploadUrl,
	setMedia
} = categoriesServiceSlice.actions;

export default categoriesServiceSlice.reducer;
