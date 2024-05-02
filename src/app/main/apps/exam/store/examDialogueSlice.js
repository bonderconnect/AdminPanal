import axios from 'app/utils/axios';
import axiosDefault from 'axios';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import * as apiServicesUser from 'app/services/apiServices/user';
import helpers from 'app/utils/helpers';
import { showMessage } from 'app/store/fuse/messageSlice';
import * as examApi from 'app/services/apiServices/exam';
import * as categoryApi from 'app/services/apiServices/category';
import * as packageApi from 'app/services/apiServices/package';
import * as learningMaterialApi from 'app/services/apiServices/learningMaterial';
import { getExams } from './examsSlice';

export const addExam = createAsyncThunk('examApp/examDialogue/addExam', async (payload, { dispatch, getState }) => {
	const { exam, callback } = payload;
	// Clearning old errors
	dispatch(setNewExamDialogueErrors({}));

	// --- Creating exam material
	const createExamPayload = {
		title: exam.title,
		description: exam.description,
		serving_priority: exam.serving_priority || 0,
		duration: exam.duration * 60,
		is_free: exam.is_free,
		is_manual_evaluation: exam.is_manual_evaluation
	};

	return examApi
		.createExam({
			data: createExamPayload
		})
		.then(response => response.data.learning_material_id)
		.then(materialId => {
			if (exam.questionsExcelFile) {
				// Creating cancel request token
				const { CancelToken } = axiosDefault;
				axios.isCancel = axiosDefault.isCancel;
				const cancelToken = new CancelToken(c => {
					// An executor function receives a cancel function as a parameter
					if (typeof window.axiosCancelReference === 'undefined') {
						window.axiosCancelReference = {};
					}
					window.axiosCancelReference['examApp/examDialogue/addExam'] = c;
				});

				const fileUploadPayload = new FormData();
				fileUploadPayload.append('file', exam.questionsExcelFile);
				let isUploadProgressSet = false;

				return axios
					.post(`learning-material/${materialId}/exam/questions-excel-import`, fileUploadPayload, {
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
					.then(() => materialId)
					.catch(() => {
						const state = getState();
						const dialogueErrors = { ...state.errors };
						dialogueErrors.file = { error: 'Unexpect error on uploading file, please try again later' };
						dispatch(setNewExamDialogueErrors(dialogueErrors));
						return Promise.reject();
					});
			}
			return Promise.resolve(materialId);
		})
		.then(materialId => {
			if (exam.category_id) {
				const bindCategoryPayload = { learning_material_ids: [materialId] };
				return categoryApi
					.bindLearningMaterials({
						urlParams: {
							categoryId: exam.category_id
						},
						data: bindCategoryPayload
					})
					.then(() => materialId);
			}
			return Promise.resolve(materialId);
		})
		.then(materialId => {
			if (exam.package_ids) {
				const bindPackagePayload = { package_ids: exam.package_ids };
				return axios
					.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
					.then(() => materialId);
			}
			return Promise.resolve(materialId);
		})
		.then(materialId => {
			if (exam.user_restriction) {
				return new Promise(resolve => {
					const state = getState();
					const {
						type: userRestrictionType,
						unsavedSelection
					} = state.examApp.examDialogue.userRestrictionDialogue;
					const userRestrictionTypePayload = { type_value: userRestrictionType === 'whitelist' ? 1 : 2 };

					learningMaterialApi
						.updateUserAccessControlType({
							data: userRestrictionTypePayload,
							urlParams: {
								learningMaterialId: materialId
							}
						})
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

							return learningMaterialApi.updateUserAccessControl({
								data: userRestrictionPayload,
								urlParams: {
									learningMaterialId: materialId
								}
							});
						})
						.then(resolve);
				});
			}
			return Promise.resolve(materialId);
		})
		.then(() => {
			dispatch(showMessage({ message: 'Material added successfully' }));
			if (callback) {
				callback();
			}
			dispatch(getExams());
		});
});

export const updateExam = createAsyncThunk(
	'examApp/examDialogue/updateExam',
	async (payload, { dispatch, getState }) => {
		const { exam, dismissDialogue } = payload;
		// Clearning old errors
		dispatch(setNewExamDialogueErrors({}));

		const materialId = exam.id;

		// --- Creating video material
		const updateExamPayload = {
			title: exam.title,
			description: exam.description,
			duration: exam.duration * 60,
			serving_priority: exam.serving_priority || 0,
			is_free: exam.is_free,
			is_manual_evaluation: exam.is_manual_evaluation
		};

		const promises = [];

		promises.push(
			examApi.updateExam({
				urlParams: {
					learningMaterialId: materialId
				},
				data: updateExamPayload
			})
		);

		// --- Binding Learning Material with Category

		// -- Remove Old / Changed Category
		if (exam.remove_category_id) {
			const unbindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				categoryApi.unbindLearningMaterials({
					urlParams: {
						categoryId: exam.remove_category_id
					},
					data: unbindCategoryPayload
				})
			);
		}

		// --- Binding Learning Material with Category
		if (exam.category_id) {
			const bindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				categoryApi.bindLearningMaterials({
					urlParams: {
						categoryId: exam.category_id
					},
					data: bindCategoryPayload
				})
			);
		}

		// --- Binding Learning Material with Package
		if (exam.package_ids) {
			const bindPackagePayload = { package_ids: exam.package_ids };
			promises.push(
				axios
					.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- User restriction actions
		if (exam.user_restriction || exam.remove_user_restriction) {
			const state = getState();
			const { userRestrictionDialogue } = state.examApp.examDialogue;

			const userRestrictionTypePayload = { type_value: null };
			if (exam.remove_user_restriction) {
				userRestrictionTypePayload.type_value = 0;
			} else if (userRestrictionDialogue.type === 'whitelist') {
				userRestrictionTypePayload.type_value = 1;
			} else if (userRestrictionDialogue.type === 'blacklist') {
				userRestrictionTypePayload.type_value = 2;
			}

			promises.push(
				learningMaterialApi.updateUserAccessControlType({
					urlParams: {
						learningMaterialId: materialId
					},
					data: userRestrictionTypePayload
				})
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

					learningMaterialApi
						.deleteUserAccessControl({
							urlParams: {
								learningMaterialId: materialId
							},
							data: userRestrictionDeletePayload
						})
						.then(
							learningMaterialApi.updateUserAccessControl({
								urlParams: {
									learningMaterialId: materialId
								},
								data: userRestrictionPayload
							})
						)
						.then(resolve);
				});

				promises.push(userRestrictionPromises);
			} else if (userRestrictionDialogue.deletedSelectionUserIds.length) {
				const userRestrictionDeletePayload = {
					user_ids: userRestrictionDialogue.deletedSelectionUserIds
				};

				promises.push(
					learningMaterialApi.deleteUserAccessControl({
						urlParams: {
							learningMaterialId: materialId
						},
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
					learningMaterialApi.updateUserAccessControl({
						urlParams: {
							learningMaterialId: materialId
						},
						data: userRestrictionPayload
					})
				);
			}
		}

		await Promise.all(promises);
		dispatch(showMessage({ message: 'Material updated successfully' }));
		if (dismissDialogue) {
			dispatch(closeEditExamDialog());
		}
		dispatch(getExams());
	}
);

export const openEditExamDialog = createAsyncThunk(
	'examApp/examDialogue/openEditExamDialog',
	async (materialId, { dispatch, getState, rejectWithValue }) => {
		const [
			learningMaterialExamResponse,
			userAccessControlResponse,
			learningMaterialPackagesResponse
		] = await Promise.all([
			examApi.getExam({
				urlParams: {
					learningMaterialId: materialId
				}
			}),
			learningMaterialApi.getUserAccessControl({
				urlParams: {
					learningMaterialId: materialId
				}
			}),
			axios
				.get(`learning-material/${materialId}/packages`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
		]);

		const learningMaterialExam = learningMaterialExamResponse.data;
		const learningMaterialPackages = learningMaterialPackagesResponse.data;
		const packageIds = learningMaterialPackages.map(item => item.id);

		// Populating user access control to store
		if (learningMaterialExam.restricted_user_access_type_value) {
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
			if (learningMaterialExam.restricted_user_access_type_value === 1) {
				restrictionType = 'whitelist';
			}
			if (learningMaterialExam.restricted_user_access_type_value === 2) {
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
			id: learningMaterialExam.learning_material_id,
			title: learningMaterialExam.title,
			description: learningMaterialExam.description,
			duration: learningMaterialExam.duration / 60,
			status_value: learningMaterialExam.learning_material_status_value,
			package_ids: packageIds,
			category_id: learningMaterialExam.category && learningMaterialExam.category.category_id,
			serving_priority: learningMaterialExam.serving_priority,
			user_restriction: !!learningMaterialExam.restricted_user_access_type_value,
			is_free: learningMaterialExam.is_free,
			is_manual_evaluation: learningMaterialExam.is_manual_evaluation
		};
		return editForm;
	}
);

export const userRestrictionSearchUsers = createAsyncThunk(
	'examApp/examDialogue/userRestrictionSearchUsers',
	async (searchText, { getState }) => {
		const state = getState();
		const { unsavedSelectionUserIds } = state.examApp.examDialogue.userRestrictionDialogue;
		const { CancelToken } = axiosDefault;
		axios.isCancel = axiosDefault.isCancel;
		const cancelToken = new CancelToken(c => {
			// An executor function receives a cancel function as a parameter
			if (typeof window.axiosCancelReference === 'undefined') {
				window.axiosCancelReference = {};
			}
			window.axiosCancelReference['examApp/examDialogue/userRestrictionSearchUsers'] = c;
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

const examDialogueSlice = createSlice({
	name: 'examApp/examDialogue',
	initialState: {
		type: 'new',
		props: {
			open: false
		},
		form: null,
		upload: {
			inProgress: false,
			percentage: null
		},
		submitting: false,
		errors: {},
		userRestrictionDialogue: userRestrictionDialogueInitialState
	},
	reducers: {
		openNewExamDialog: (state, action) => {
			state = {
				...state,
				userRestrictionDialogue: userRestrictionDialogueInitialState,
				type: 'new',
				props: {
					open: true
				},
				submitting: false,
				form: action.payload,
				errors: {}
			};
			return state;
		},
		setNewExamDialogueErrors: (state, action) => {
			state.errors = action.payload;
		},
		setUploadInProgress: (state, action) => {
			state.upload.inProgress = action.payload;
		},
		setUploadPercentage: (state, action) => {
			state.upload.percentage = action.payload;
		},
		closeNewExamDialog: state => {
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
		closeEditExamDialog: state => {
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
		[addExam.pending]: state => {
			state.submitting = true;
		},
		[addExam.fulfilled]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
		},
		[addExam.rejected]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
		},
		[openEditExamDialog.pending]: state => {
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
				loading: true,
				submitting: false,
				form: null,
				errors: {}
			};
			return state;
		},
		[openEditExamDialog.fulfilled]: (state, action) => {
			state.loading = false;
			state.form = action.payload;
		},
		[updateExam.pending]: state => {
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
	openNewExamDialog,
	setNewExamDialogueErrors,
	closeNewExamDialog,
	closeEditExamDialog,
	setUploadInProgress,
	setUploadPercentage,
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
} = examDialogueSlice.actions;

export default examDialogueSlice.reducer;
