import axios from 'app/utils/axios';
import axiosDefault from 'axios';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/user';
import helpers from 'app/utils/helpers';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getVideos } from './videosSlice';

export const addVideo = createAsyncThunk(
	'liveEvent/recordings/videoDialogue/addVideo',
	async (payload, { dispatch, getState }) => {
		const { video, dismissDialogue } = payload;
		// Clearning old errors
		dispatch(setNewVideoDialogueErrors({}));

		// --- Creating video material
		const createVideoPayload = {
			title: video.title,
			description: video.description,
			serving_priority: video.serving_priority || 0,
			is_free: video.is_free,
			is_live_recording: true
		};

		return axios
			.post('learning-material/video', createVideoPayload)
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			.then(({ data: { learning_material_id: materialId } }) => {
				if (video.file) {
					// Creating cancel request token
					const { CancelToken } = axiosDefault;
					axios.isCancel = axiosDefault.isCancel;
					const cancelToken = new CancelToken(c => {
						// An executor function receives a cancel function as a parameter
						if (typeof window.axiosCancelReference === 'undefined') {
							window.axiosCancelReference = {};
						}
						window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'] = c;
					});

					const fileUploadPayload = new FormData();
					fileUploadPayload.append('file', video.file);
					let isUploadProgressSet = false;

					return axios
						.patch(`learning-material/video/${materialId}/file`, fileUploadPayload, {
							cancelToken,
							onUploadProgress: evt => {
								if (!isUploadProgressSet) {
									dispatch(setUploadInProgress((isUploadProgressSet = true)));
								}
								let percentComplete = evt.loaded / evt.total;
								percentComplete = Number(percentComplete * 100).toFixed(2);
								dispatch(setUploadPercentage(percentComplete));
							},
							headers: { 'content-type': 'multipart/form-data' }
						})
						.then(() => {
							delete window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'];
							return Promise.resolve(materialId);
						})
						.catch(() => {
							const state = getState();
							const dialogueErrors = { ...state.errors };
							dialogueErrors.file = { error: 'Unexpect error on uploading file, please try again later' };
							dispatch(setNewVideoDialogueErrors(dialogueErrors));
							return Promise.reject();
						});
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.fileThumbnail) {
					return axios
						.get(`learning-material/video/thumbnail-upload-s3-presigned-url`)
						.then(s3SignedUrlResp => {
							const s3SignedUrlData = s3SignedUrlResp.data.data;
							const { CancelToken } = axiosDefault;
							axios.isCancel = axiosDefault.isCancel;
							const cancelToken = new CancelToken(c => {
								// An executor function receives a cancel function as a parameter
								if (typeof window.axiosCancelReference === 'undefined') {
									window.axiosCancelReference = {};
								}
								window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'] = c;
							});

							const fileUploadPayload = new FormData();
							let isUploadProgressSet = false;

							let thumbnailFileKey = null;
							Object.keys(s3SignedUrlData.fields).forEach(key => {
								fileUploadPayload.append(key, s3SignedUrlData.fields[key]);
								if (key === 'key') thumbnailFileKey = s3SignedUrlData.fields[key];
							});
							fileUploadPayload.append('file', video.fileThumbnail);

							return axiosDefault
								.post(s3SignedUrlData.url, fileUploadPayload, {
									cancelToken,
									onUploadProgress: evt => {
										if (!isUploadProgressSet) {
											dispatch(setUploadThumbnailInProgress((isUploadProgressSet = true)));
										}
										let percentComplete = evt.loaded / evt.total;
										percentComplete = Number(percentComplete * 100).toFixed(2);
										dispatch(setUploadThumbnailPercentage(percentComplete));
									},
									headers: { 'content-type': 'multipart/form-data' }
								})
								.then(() => {
									delete window.axiosCancelReference[
										'liveEventApp/recordings/videoDialogue/updateVideo'
									];

									return axios
										.patch(`learning-material/video/${materialId}/thumbnail`, {
											thumbnail_file_key: thumbnailFileKey
										})
										.then(() => materialId);
								})
								.catch(() => {
									const state = getState();
									const dialogueErrors = { ...state.errors };
									dialogueErrors.file = {
										error: 'Unexpected error on uploading file, please try again later'
									};
									dispatch(setNewVideoDialogueErrors(dialogueErrors));
									return Promise.reject();
								});
						});
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.youtube_link) {
					const youtubeLinkPayload = { youtube_link: video.youtube_link };
					return axios
						.patch(`learning-material/video/${materialId}/youtube-link`, youtubeLinkPayload)
						.then(() => materialId);
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.category_id) {
					const bindCategoryPayload = { learning_material_ids: [materialId] };
					return axios
						.post(`/category/${video.category_id}/bind-learning-materials`, bindCategoryPayload)
						.then(() => materialId);
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.package_ids) {
					const bindPackagePayload = { package_ids: video.package_ids };
					return axios
						.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
						.then(() => materialId);
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.status_value) {
					return axios.patch(`learning-material/video/${materialId}/publish`).then(() => materialId);
				}
				return Promise.resolve(materialId);
			})
			.then(materialId => {
				if (video.user_restriction) {
					return new Promise(resolve => {
						const state = getState();
						const {
							type: userRestrictionType,
							unsavedSelection
						} = state.liveEventApp.recordings.videoDialogue.userRestrictionDialogue;
						const userRestrictionTypePayload = { type_value: userRestrictionType === 'whitelist' ? 1 : 2 };
						axios
							.patch(
								`learning-material/${materialId}/user-access-control/type`,
								userRestrictionTypePayload
							)
							.then(() => {
								const userRestrictionPayload = Object.keys(unsavedSelection).map(userId => {
									const userRestrictionObj = unsavedSelection[userId];
									const obj = {
										user_id: userId
									};
									if (userRestrictionObj.validFrom) {
										obj.valid_from = userRestrictionObj.validFromDate;
									}
									if (userRestrictionObj.validTo) {
										obj.valid_to = userRestrictionObj.validToDate;
									}
									return obj;
								});

								return axios.patch(
									`learning-material/${materialId}/user-access-control`,
									userRestrictionPayload
								);
							})
							.then(resolve);
					});
				}
				return Promise.resolve(materialId);
			})
			.then(() => {
				dispatch(showMessage({ message: 'Live recording added successfully' }));
				if (dismissDialogue) {
					dispatch(closeNewVideoDialog());
				}
				dispatch(getVideos());
			});
	}
);

export const updateVideo = createAsyncThunk(
	'liveEvent/recordings/videoDialogue/updateVideo',
	async (payload, { dispatch, getState }) => {
		const { video, dismissDialogue } = payload;
		// Clearning old errors
		dispatch(setNewVideoDialogueErrors({}));

		const materialId = video.id;

		// --- Creating video material
		const createVideoPayload = {
			title: video.title,
			description: video.description,
			serving_priority: video.serving_priority || 0,
			is_free: video.is_free
		};

		const promises = [];

		promises.push(
			axios
				.patch(`learning-material/${materialId}`, createVideoPayload)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
		);

		// --- Binding Learning Material with Category

		if (video.file) {
			// Creating cancel request token
			const { CancelToken } = axiosDefault;
			axios.isCancel = axiosDefault.isCancel;
			const cancelToken = new CancelToken(c => {
				// An executor function receives a cancel function as a parameter
				if (typeof window.axiosCancelReference === 'undefined') {
					window.axiosCancelReference = {};
				}
				window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'] = c;
			});

			const fileUploadPayload = new FormData();
			fileUploadPayload.append('file', video.file);
			let isUploadProgressSet = false;
			promises.push(
				axios
					.patch(`learning-material/video/${materialId}/file`, fileUploadPayload, {
						cancelToken,
						onUploadProgress: evt => {
							if (!isUploadProgressSet) {
								dispatch(setUploadInProgress((isUploadProgressSet = true)));
							}
							let percentComplete = evt.loaded / evt.total;
							percentComplete = Number(percentComplete * 100).toFixed(2);
							dispatch(setUploadPercentage(percentComplete));
						},
						headers: { 'content-type': 'multipart/form-data' }
					})
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
					.catch(() => {
						const state = getState();
						const dialogueErrors = { ...state.errors };
						dialogueErrors.file = { error: 'Unexpect error on uploading file, please try again later' };
						dispatch(setNewVideoDialogueErrors(dialogueErrors));
					})
			);
		} else if (video.youtube_link) {
			const youtubeLinkPayload = { youtube_link: video.youtube_link };
			promises.push(axios.patch(`learning-material/video/${materialId}/youtube-link`, youtubeLinkPayload));
		}

		if (video.fileThumbnail) {
			promises.push(
				axios.get(`learning-material/video/thumbnail-upload-s3-presigned-url`).then(s3SignedUrlResp => {
					const s3SignedUrlData = s3SignedUrlResp.data.data;
					const { CancelToken } = axiosDefault;
					axios.isCancel = axiosDefault.isCancel;
					const cancelToken = new CancelToken(c => {
						// An executor function receives a cancel function as a parameter
						if (typeof window.axiosCancelReference === 'undefined') {
							window.axiosCancelReference = {};
						}
						window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'] = c;
					});

					const fileUploadPayload = new FormData();
					let isUploadProgressSet = false;

					let thumbnailFileKey = null;
					Object.keys(s3SignedUrlData.fields).forEach(key => {
						fileUploadPayload.append(key, s3SignedUrlData.fields[key]);
						if (key === 'key') thumbnailFileKey = s3SignedUrlData.fields[key];
					});
					fileUploadPayload.append('file', video.fileThumbnail);

					return axiosDefault
						.post(s3SignedUrlData.url, fileUploadPayload, {
							cancelToken,
							onUploadProgress: evt => {
								if (!isUploadProgressSet) {
									dispatch(setUploadThumbnailInProgress((isUploadProgressSet = true)));
								}
								let percentComplete = evt.loaded / evt.total;
								percentComplete = Number(percentComplete * 100).toFixed(2);
								dispatch(setUploadThumbnailPercentage(percentComplete));
							},
							headers: { 'content-type': 'multipart/form-data' }
						})
						.then(() => {
							delete window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo'];

							return axios
								.patch(`learning-material/video/${materialId}/thumbnail`, {
									thumbnail_file_key: thumbnailFileKey
								})
								.then(() => materialId);
						})
						.catch(() => {
							const state = getState();
							const dialogueErrors = { ...state.errors };
							dialogueErrors.file = {
								error: 'Unexpected error on uploading file, please try again later'
							};
							dispatch(setNewVideoDialogueErrors(dialogueErrors));
							return Promise.reject();
						});
				})
			);
		}

		// -- Remove Old / Changed Category
		if (video.remove_category_id) {
			const bindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				axios
					.post(`/category/${video.remove_category_id}/unbind-learning-materials`, bindCategoryPayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- Binding Learning Material with Category
		if (video.category_id) {
			const bindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				axios
					.post(`/category/${video.category_id}/bind-learning-materials`, bindCategoryPayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- Binding Learning Material with Package
		if (video.package_ids) {
			const bindPackagePayload = { package_ids: video.package_ids };
			promises.push(
				axios
					.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- User restriction actions
		if (video.user_restriction || video.remove_user_restriction) {
			const state = getState();
			const { userRestrictionDialogue } = state.liveEventApp.recordings.videoDialogue;

			const userRestrictionTypePayload = { type_value: null };
			if (video.remove_user_restriction) {
				userRestrictionTypePayload.type_value = 0;
			} else if (userRestrictionDialogue.type === 'whitelist') {
				userRestrictionTypePayload.type_value = 1;
			} else if (userRestrictionDialogue.type === 'blacklist') {
				userRestrictionTypePayload.type_value = 2;
			}

			promises.push(
				axios
					.patch(`learning-material/${materialId}/user-access-control/type`, userRestrictionTypePayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);

			if (
				userRestrictionDialogue.deletedSelectionUserIds.length &&
				userRestrictionDialogue.unsavedSelectionUserIds.length
			) {
				const userRestrictionPromises = new Promise(resolve => {
					const userRestrictionDeletePayload = {
						user_ids: userRestrictionDialogue.deletedSelectionUserIds
					};

					const userRestrictionPayload = Object.keys(userRestrictionDialogue.unsavedSelection).map(userId => {
						const userRestrictionObj = userRestrictionDialogue.unsavedSelection[userId];
						const obj = {
							user_id: userId
						};
						if (userRestrictionObj.validFrom) {
							obj.valid_from = userRestrictionObj.validFromDate;
						}
						if (userRestrictionObj.validTo) {
							obj.valid_to = userRestrictionObj.validToDate;
						}
						return obj;
					});

					axios
						.delete(`learning-material/${materialId}/user-access-control`, {
							data: userRestrictionDeletePayload
						})
						.then(
							axios.patch(`learning-material/${materialId}/user-access-control`, userRestrictionPayload)
						)
						.then(resolve);
				});

				promises.push(userRestrictionPromises);
			} else if (userRestrictionDialogue.deletedSelectionUserIds.length) {
				const userRestrictionDeletePayload = {
					user_ids: userRestrictionDialogue.deletedSelectionUserIds
				};

				promises.push(
					axios.delete(`learning-material/${materialId}/user-access-control`, {
						data: userRestrictionDeletePayload
					})
				);
			} else if (userRestrictionDialogue.unsavedSelectionUserIds.length) {
				const userRestrictionPayload = Object.keys(userRestrictionDialogue.unsavedSelection).map(userId => {
					const userRestrictionObj = userRestrictionDialogue.unsavedSelection[userId];
					const obj = {
						user_id: userId
					};
					if (userRestrictionObj.validFrom) {
						obj.valid_from = userRestrictionObj.validFromDate;
					}
					if (userRestrictionObj.validTo) {
						obj.valid_to = userRestrictionObj.validToDate;
					}
					return obj;
				});

				promises.push(
					axios.patch(`learning-material/${materialId}/user-access-control`, userRestrictionPayload)
				);
			}
		}

		await Promise.all(promises);
		dispatch(showMessage({ message: 'Live recording updated successfully' }));
		if (dismissDialogue) {
			dispatch(closeEditVideoDialog());
		}
		dispatch(getVideos());
	}
);

export const openEditVideoDialog = createAsyncThunk(
	'liveEvent/recordings/videoDialogue/openEditVideoDialog',
	async (materialId, { dispatch, getState, rejectWithValue }) => {
		const [
			learningMaterialVideoResponse,
			userAccessControlResponse,
			learningMaterialPackagesResponse
		] = await Promise.all([
			axios
				.get(`learning-material/video/${materialId}`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse)),
			axios
				.get(`learning-material/${materialId}/user-access-control`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true })),
			axios
				.get(`learning-material/${materialId}/packages`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
		]);

		const learningMaterialVideo = learningMaterialVideoResponse.data;
		const learningMaterialPackages = learningMaterialPackagesResponse.data;
		const packageIds = learningMaterialPackages.map(item => item.id);

		// Populating user access control to store
		if (learningMaterialVideo.restricted_user_access_type_value) {
			const userAccessControl = userAccessControlResponse.data;

			const previousSelection = {};
			const previousSelectionUserIds = [];

			userAccessControl.forEach(item => {
				previousSelection[item.user_id] = {
					validFrom: !!item.valid_from,
					validFromDate: item.valid_from ? new Date(item.valid_from) : new Date(),
					validTo: !!item.valid_to,
					validToDate: item.valid_to ? new Date(item.valid_to) : new Date()
				};
				previousSelectionUserIds.push(item.user_id);
			});

			const userAccessControlUsersResponse = await apiServicesUser.getUsers({
				params: {
					limit: -1,
					include_user_ids: previousSelectionUserIds
				}
			});

			userAccessControlUsersResponse.data.forEach(item => {
				previousSelection[item.id].user = item;
			});

			let restrictionType = null;
			if (learningMaterialVideo.restricted_user_access_type_value === 1) {
				restrictionType = 'whitelist';
			}
			if (learningMaterialVideo.restricted_user_access_type_value === 2) {
				restrictionType = 'blacklist';
			}

			dispatch(userRestrictionDialogChangeType(restrictionType));

			dispatch(
				userRestrictionDialogSetPreviousSelection({
					previousSelection,
					previousSelectionUserIds
				})
			);
		}

		const editForm = {
			id: learningMaterialVideo.learning_material_id,
			title: learningMaterialVideo.title,
			description: learningMaterialVideo.description,
			status_value: learningMaterialVideo.learning_material_status_value,
			package_ids: packageIds,
			category_id: learningMaterialVideo.category && learningMaterialVideo.category.category_id,
			serving_priority: learningMaterialVideo.serving_priority,
			user_restriction: !!learningMaterialVideo.restricted_user_access_type_value,
			is_free: learningMaterialVideo.is_free,
			youtube_link:
				learningMaterialVideo.learning_material_video_meta.streamingService === 'youtube' &&
				`https://www.youtube.com/watch?v=${learningMaterialVideo.learning_material_video_meta.youtubeVideoId}`
		};
		return editForm;
	}
);

export const userRestrictionSearchUsers = createAsyncThunk(
	'liveEvent/recordings/videoDialogue/userRestrictionSearchUsers',
	async (searchText, { dispatch, getState, rejectWithValue }) => {
		const state = getState();
		const { unsavedSelectionUserIds } = state.liveEventApp.recordings.videoDialogue.userRestrictionDialogue;
		const { CancelToken } = axiosDefault;
		axios.isCancel = axiosDefault.isCancel;
		const cancelToken = new CancelToken(c => {
			// An executor function receives a cancel function as a parameter
			if (typeof window.axiosCancelReference === 'undefined') {
				window.axiosCancelReference = {};
			}
			window.axiosCancelReference['liveEventApp/recordings/videoDialogue/userRestrictionSearchUsers'] = c;
		});

		const result = await apiServicesUser.getUsers({
			params: {
				limit: 10,
				page: 1,
				search: searchText,
				exclude_user_ids:
					(unsavedSelectionUserIds && unsavedSelectionUserIds.length && unsavedSelectionUserIds) || undefined
			}
		});

		return { users: result.data || [], searchText };
	}
);

const userRestrictionDialogueInitialState = {
	activeTabIndex: 0,
	open: false,
	type: 'whitelist',
	previousSelection: null,
	previousSelectionUserIds: [],
	unsavedSelection: null,
	unsavedSelectionUserIds: [],
	deletedSelection: null,
	deletedSelectionUserIds: [],
	addUsersList: {
		activeStepIndex: 0,
		searchProgressing: false,
		list: null,
		listSearchText: null,
		selection: null,
		selectionUserIds: [],
		validFromDate: new Date(),
		validToDate: new Date(),
		validFrom: false,
		validTo: false,
		params: {
			page: 1,
			limit: 10
		}
	}
};
const initialState = {
	type: 'new',
	props: {
		open: false
	},
	form: null,
	upload: {
		inProgress: false,
		percentage: null
	},
	uploadThumbnail: {
		inProgress: false,
		percentage: null
	},
	submitting: false,
	errors: {},
	learningMaterialPackages: [],
	userRestrictionDialogue: userRestrictionDialogueInitialState
};

const videoDialogueSlice = createSlice({
	name: 'liveEventApp/recordings/videoDialogue',
	initialState,
	reducers: {
		openNewVideoDialog: (state, action) => {
			state = {
				...state,
				userRestrictionDialogue: userRestrictionDialogueInitialState,
				type: 'new',
				props: {
					open: true
				},
				submitting: false,
				form: action.payload,
				upload: {
					inProgress: false,
					percentage: null
				},
				uploadThumbnail: {
					inProgress: false,
					percentage: null
				},
				errors: {}
			};
			return state;
		},
		setNewVideoDialogueErrors: (state, action) => {
			state.errors = action.payload;
		},
		setUploadInProgress: (state, action) => {
			state.upload.inProgress = action.payload;
		},
		setUploadPercentage: (state, action) => {
			state.upload.percentage = action.payload;
		},
		cancelFileUpload: state => {
			if (
				window.axiosCancelReference &&
				window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo']
			) {
				window.axiosCancelReference['liveEventApp/recordings/videoDialogue/updateVideo']();
			}
			state.upload = {
				inProgress: false,
				percentage: null,
				cancelled: true
			};
			state.submitting = false;
		},
		setUploadThumbnailInProgress: (state, action) => {
			state.uploadThumbnail.inProgress = action.payload;
		},
		setUploadThumbnailPercentage: (state, action) => {
			state.uploadThumbnail.percentage = action.payload;
		},
		closeNewVideoDialog: state => {
			state = {
				...state,
				type: 'new',
				props: {
					open: false
				},
				submitting: false,
				form: null,
				errors: {}
			};
			return state;
		},
		closeEditVideoDialog: state => {
			state.props.open = false;
		},
		openUserRestrictionDialog: state => {
			state.userRestrictionDialogue.open = true;
			state.userRestrictionDialogue.addUsersList = {
				...state.userRestrictionDialogue.addUsersList,
				activeStepIndex: 0,
				list: null,
				listSearchText: null,
				selection: null,
				selectionUserIds: [],
				validFromDate: new Date(),
				validToDate: new Date(),
				validFrom: false,
				validTo: false
			};
		},
		userRestrictionDialogSetActiveTab: (state, action) => {
			state.userRestrictionDialogue.activeTabIndex = action.payload;
		},
		closeUserRestrictionDialog: state => {
			state.userRestrictionDialogue.open = false;
		},
		userRestrictionDialogChangeType: (state, action) => {
			state.userRestrictionDialogue.type = action.payload;
		},
		userRestrictionDialogAddUserSetSelection: (state, action) => {
			state.userRestrictionDialogue.addUsersList.selection = action.payload.selectionUpdated;
			state.userRestrictionDialogue.addUsersList.selectionUserIds = action.payload.selectionUserIdsUpdated;
		},
		userRestrictionDialogSetUnsavedSelection: (state, action) => {
			state.userRestrictionDialogue.unsavedSelection = action.payload.unsavedSelection;
			state.userRestrictionDialogue.unsavedSelectionUserIds = action.payload.unsavedSelectionUserIds;
		},
		userRestrictionDialogSetPreviousSelection: (state, action) => {
			state.userRestrictionDialogue.previousSelection = action.payload.previousSelection;
			state.userRestrictionDialogue.previousSelectionUserIds = action.payload.previousSelectionUserIds;
		},
		userRestrictionDialogSetDeletedSelection: (state, action) => {
			state.userRestrictionDialogue.deletedSelection = action.payload.deletedSelection;
			state.userRestrictionDialogue.deletedSelectionUserIds = action.payload.deletedSelectionUserIds;
		},
		userRestrictionDialogSetActiveStep: (state, action) => {
			state.userRestrictionDialogue.addUsersList.activeStepIndex = action.payload;
		},
		userRestrictionDialogSetValidFromDate: (state, action) => {
			state.userRestrictionDialogue.addUsersList.validFromDate = action.payload;
		},
		userRestrictionDialogSetValidToDate: (state, action) => {
			state.userRestrictionDialogue.addUsersList.validToDate = action.payload;
		},
		userRestrictionDialogSetValidFrom: (state, action) => {
			state.userRestrictionDialogue.addUsersList.validFrom = action.payload;
		},
		userRestrictionDialogSetValidTo: (state, action) => {
			state.userRestrictionDialogue.addUsersList.validTo = action.payload;
		},
		userRestrictionDialogHandleOk: state => {
			const { addUsersList } = state.userRestrictionDialogue;
			const { selectionUserIds, selection } = addUsersList;
			const unsavedSelectionUserIds = [];
			const unsavedSelection = {};
			selectionUserIds.forEach(userId => {
				unsavedSelection[userId] = {
					validFromDate: addUsersList.validFromDate,
					validToDate: addUsersList.validToDate,
					validFrom: addUsersList.validFrom,
					validTo: addUsersList.validTo,
					user: selection[userId].user
				};
				unsavedSelectionUserIds.push(userId);
			});
			state.userRestrictionDialogue.unsavedSelectionUserIds = [
				...state.userRestrictionDialogue.unsavedSelectionUserIds,
				...unsavedSelectionUserIds
			];
			state.userRestrictionDialogue.unsavedSelection = {
				...state.userRestrictionDialogue.unsavedSelection,
				...unsavedSelection
			};
			state.userRestrictionDialogue.open = false;
		},
		userRestrictionDialogHandleCancel: state => {
			state.userRestrictionDialogue.open = false;
		}
	},
	extraReducers: {
		[addVideo.pending]: state => {
			state.submitting = true;
		},
		[addVideo.fulfilled]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
			state.uploadThumbnail = {
				inProgress: false,
				percentage: null
			};
		},
		[addVideo.rejected]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
			state.uploadThumbnail = {
				inProgress: false,
				percentage: null
			};
		},
		[openEditVideoDialog.pending]: state => {
			state = {
				...state,
				userRestrictionDialogue: userRestrictionDialogueInitialState,
				type: 'edit',
				props: {
					open: true
				},
				upload: {
					inProgress: false,
					percentage: null
				},
				uploadThumbnail: {
					inProgress: false,
					percentage: null
				},
				loading: true,
				submitting: false,
				form: null,
				errors: {}
			};
			return state;
		},
		[openEditVideoDialog.fulfilled]: (state, action) => {
			state.loading = false;
			state.form = action.payload;
		},
		[updateVideo.pending]: state => {
			state.submitting = true;
		},
		[userRestrictionSearchUsers.pending]: state => {
			state.userRestrictionDialogue.addUsersList.searchProgressing = true;
		},
		[userRestrictionSearchUsers.fulfilled]: (state, action) => {
			state.userRestrictionDialogue.addUsersList.searchProgressing = false;
			state.userRestrictionDialogue.addUsersList.list = action.payload.users;
			state.userRestrictionDialogue.addUsersList.listSearchText = action.payload.searchText;
		}
	}
});

export const {
	openNewVideoDialog,
	setNewVideoDialogueErrors,
	closeNewVideoDialog,
	closeEditVideoDialog,
	setUploadInProgress,
	setUploadPercentage,
	setUploadThumbnailInProgress,
	setUploadThumbnailPercentage,
	cancelFileUpload,
	openUserRestrictionDialog,
	userRestrictionDialogChangeType,
	userRestrictionDialogAddUserSetSelection,
	userRestrictionDialogSetActiveTab,
	userRestrictionDialogSetActiveStep,
	userRestrictionDialogSetValidFromDate,
	userRestrictionDialogSetValidToDate,
	userRestrictionDialogSetValidFrom,
	userRestrictionDialogSetValidTo,
	userRestrictionDialogHandleOk,
	userRestrictionDialogHandleCancel,
	userRestrictionDialogSetUnsavedSelection,
	userRestrictionDialogSetPreviousSelection,
	userRestrictionDialogSetDeletedSelection
} = videoDialogueSlice.actions;

export default videoDialogueSlice.reducer;
