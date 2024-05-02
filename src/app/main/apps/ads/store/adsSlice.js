import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axiosInstance from 'app/utils/axios';
import helpers from 'app/utils/helpers';
import * as apiServicesUser from 'app/services/apiServices/user';

export const openEditUserDialog = createAsyncThunk('ads/openEditUserDialog', async (userId, { getState }) => {
	const getUserResult = await apiServicesUser.getUser({ urlParams: { userId } });
	const userData = getUserResult.data;
	const userDialogData = {
		id: userData.id,
		name: (userData.profile_fields && userData.profile_fields.name) || '',
		email: userData.email,
		phone: userData.phone,
		status_value: userData.status_value,
		user_roles: userData.user_role || []
	};
	return userDialogData;
});

export const addAds = createAsyncThunk('ads/addUser', async (payload, { dispatch, getState, rejectWithValue }) => {
	const { ads } = payload;
	const createAdsPayload = {
		status_value: ads.status_value,
		ad_content: ads.group,
		image1: ads.image1,
		image2: ads.image2,
		image3: ads.image3
	};
	// Function to get presigned URL and upload image
	const uploadImage = async (imageData, index) => {
		console.log(`🚀  uploadImage  imageData:`, imageData);
		try {
			if (!imageData || !imageData.file_name) {
				throw new Error(`Image data for image ${index + 1} is missing or invalid.`);
			}

			// Request presigned URL
			let presignedUrlData;
			try {
				const presignedUrlResponse = await axiosInstance.get('/image-upload-s3-presigned-url', {
					params: { key: imageData.file_name }
				});
				presignedUrlData = presignedUrlResponse.data.data;
				console.log(`🚀  uploadImage  presignedUrlData:`, presignedUrlData);
			} catch (error) {
				throw new Error(`Error getting presigned URL for image ${index + 1}: ${error.message}`);
			}

			const fileUploadPayload = new FormData();

			// Append fields to payload
			Object.keys(presignedUrlData.fields).forEach(key => {
				fileUploadPayload.append(key, presignedUrlData.fields[key]);
			});

			// Append file to payload
			fileUploadPayload.append('file', imageData.file, imageData.file_name);

			try {
				// Upload the file to S3
				const s3Response = await axiosInstance
					.request({
						url: presignedUrlData.url,
						method: 'POST',
						data: fileUploadPayload,
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: ''
						}
					})
					.then(response => {
						console.log('response:', response);
						return response;
					})
					.catch(error => {
						console.log('error', error);
					});
				createAdsPayload[`image${index + 1}`].uri = presignedUrlData.url; // Update the payload with the URL
				console.log(`Image ${index + 1} uploaded successfully:`, s3Response);
				// Check if the key is present in the response
				// if (!s3Response.data || !s3Response.data.key) {
				// 	throw new Error(`The S3 upload response does not contain the file key.`);
				// }
				// const fileKey = s3Response.data.key; // Assuming the response contains the file key
				const fileKey = presignedUrlData?.fields.key; // Assuming the response contains the file key
				console.log(`🚀  uploadImage  fileKey:`, fileKey);

				// Create media record
				let createdMediaData;
				try {
					const mediaPayload = {
						...imageData,
						file_key: fileKey
					};
					delete mediaPayload.file;
					delete mediaPayload.media_id;
					delete mediaPayload.priority;
					delete mediaPayload.url;
					delete mediaPayload.uri;
					delete mediaPayload.general;
					delete mediaPayload.lastModifiedDate;
					console.log(`🚀  uploadImage  mediaPayload:`, mediaPayload);

					const createMediaResponse = await axiosInstance.post('/media', mediaPayload);
					console.log(`🚀  uploadImage  createMediaResponse:`, createMediaResponse);
					createdMediaData = createMediaResponse.data.data;
					dispatch(setUploadUrl(`${presignedUrlData.url}/${fileKey}`));
					dispatch(setMedia(createdMediaData.media_id));
					dispatch(uploadFileSuccess());
				} catch (error) {
					throw new Error(`Error creating media record for image ${index + 1}: ${error.message}`);
				}

				// Update the createAdsPayload with the media_id and priority
				createAdsPayload[`image${index + 1}`] = {
					...createAdsPayload[`image${index + 1}`],
					media_id: createdMediaData.media_id,
					priority: index + 1
				};
			} catch (error) {
				throw new Error(`Error uploading image ${index + 1}`);
			}
		} catch (error) {
			console.error(`Failed to process image ${index + 1} : ${error.message}`);
			// Handle the error appropriately
			// Depending on your use case, you might want to throw the error,
			// return a specific error object, or handle it in some other way.
		}
	};

	// Upload images and get URLs
	await Promise.all([uploadImage(ads.image1, 0), uploadImage(ads.image2, 1), uploadImage(ads.image3, 2)]);

	const validationErrors = {};

	if (Object.keys(validationErrors).length) {
		return rejectWithValue({
			errors: validationErrors
		});
	}

	try {
		const createUserResponse = await axiosInstance
			.post('/ads-images', createAdsPayload)
			.then(helpers.parseApiResponse);
		console.log(`🚀  addAds  createUserResponse:`, createUserResponse);
	} catch (error) {
		console.error(error);
		throw new Error(`Error creating ads: ${error.message}`);
	}
	// const { userId } = createUserResponse.data;

	// updating user name via patch method
	// const patchUserPayload = { profile_fields: { name: user.name } };
	// const patchUserResponse = await axios.patch(`/user/${userId}`, patchUserPayload).then(helpers.parseApiResponse);
	// const createdUser = patchUserResponse.data;

	if (payload.closeNewUserDialog) {
		dispatch(closeNewUserDialog());
	}
	// dispatch(getUsers());

	return createAdsPayload;
});
export const getAds = createAsyncThunk('ads/getAds', async (payload, { dispatch, getState, rejectWithValue }) => {
	try {
		const getAdsResponse = await axiosInstance.get('/ads');
		return getAdsResponse.data;
	} catch (error) {
		console.error(error);
		throw new Error(`Error getting ads: ${error.message}`);
	}
});

const adsAdapter = createEntityAdapter({ selectId: entity => entity.user_id });

export const { selectAll: selectAds, selectById: selectUsersById } = adsAdapter.getSelectors(
	state => state.usersApp.users
);
const adsSlice = createSlice({
	name: 'ads',
	initialState: adsAdapter.getInitialState({
		searchText: '',
		loading: false,
		params: {
			page: 1,
			limit: 10
		},
		count: null,
		userDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			loading: false,
			submitting: false,
			errors: null
		},
		ads: null
	}),
	reducers: {
		setUsersSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setUsersParams: (state, action) => {
			state.params = action.payload;
		},
		setUsersLoading: (state, action) => {
			state.loading = action.payload;
		},
		// setAdsCount: (state, action) => {
		// 	state.count = action.payload;
		// },
		openNewUserDialog: state => {
			state.userDialog = {
				type: 'new',
				props: {
					open: true
				},
				submitting: false,
				data: null,
				errors: null
			};
		},
		setNewUserDialogErrors: (state, action) => {
			state.userDialog.errors = action.payload;
		},
		closeNewUserDialog: state => {
			state.userDialog = {
				...state.userDialog,
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		closeEditUserDialog: (state, action) => {
			state.userDialog = {
				...state.userDialog,
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
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
		setUploadUrl: (state, action) => {
			state.uploadUrl = action.payload;
		},
		setMedia: (state, action) => {
			state.media_id = action.payload;
		},
		resetUploadUrl: state => {
			state.uploadUrl = 'idle';
		}
	},
	extraReducers: {
		[openEditUserDialog.pending]: (state, action) => {
			state.userDialog = {
				type: 'edit',
				props: {
					open: true
				},
				loading: true,
				data: null,
				errors: null
			};
		},
		[openEditUserDialog.fulfilled]: (state, action) => {
			state.userDialog.data = action.payload;
			state.userDialog.loading = false;
		},
		[getAds.pending]: (state, action) => {
			state.loading = true;
		},
		[getAds.fulfilled]: (state, action) => {
			state.loading = false;
			state.ads = action.payload;
		},
		[getAds.rejected]: (state, action) => {
			state.loading = false;
			state.ads = [];
		}
	}
});

export const {
	setUsersParams,
	setUsersSearchText,
	openNewUserDialog,
	closeNewUserDialog,
	closeEditUserDialog,
	setNewUserDialogErrors,
	uploadFileSuccess,
	uploadFileError,
	setUploadUrl,
	resetUploadUrl,
	setMedia,
	setAdsCount
} = adsSlice.actions;

export default adsSlice.reducer;
