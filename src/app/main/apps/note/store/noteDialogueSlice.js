import axios from 'app/utils/axios';
import axiosDefault from 'axios';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import helpers from 'app/utils/helpers';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getNotes } from './notesSlice';

export const addNote = createAsyncThunk('noteApp/noteDialogue/addNote', async (payload, { dispatch, getState }) => {
	const { note, dismissDialogue } = payload;
	// Clearning old errors
	dispatch(setNewNoteDialogueErrors({}));

	// --- Creating note material
	const createNotePayload = {
		title: note.title,
		description: note.description,
		serving_priority: note.serving_priority || 0,
		is_free: note.is_free
	};

	return axios
		.post('learning-material/note', createNotePayload)
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
		.then(({ data: { learning_material_id: materialId } }) => {
			const { CancelToken } = axiosDefault;
			axios.isCancel = axiosDefault.isCancel;
			const cancelToken = new CancelToken(c => {
				// An executor function receives a cancel function as a parameter
				window.axiosCancelReference = c;
			});

			const fileUploadPayload = new FormData();
			fileUploadPayload.append('file', note.file);
			let isUploadProgressSet = false;

			return axios
				.patch(`learning-material/note/${materialId}/file`, fileUploadPayload, {
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
					dispatch(setNewNoteDialogueErrors(dialogueErrors));
					return Promise.reject();
				});
		})
		.then(materialId => {
			if (note.category_id) {
				const bindCategoryPayload = { learning_material_ids: [materialId] };
				return axios
					.post(`/category/${note.category_id}/bind-learning-materials`, bindCategoryPayload)
					.then(() => materialId);
			}
			return Promise.resolve(materialId);
		})
		.then(materialId => {
			if (note.package_ids) {
				const bindPackagePayload = { package_ids: note.package_ids };
				return axios
					.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
					.then(() => materialId);
			}
			return Promise.resolve(materialId);
		})
		.then(materialId => {
			if (note.status_value) {
				return axios.patch(`learning-material/note/${materialId}/publish`).then(() => materialId);
			}
			return Promise.resolve(materialId);
		})
		.then(() => {
			dispatch(showMessage({ message: 'Material added successfully' }));
			if (dismissDialogue) {
				dispatch(closeNewNoteDialog());
			}
			dispatch(getNotes());
		});
});

export const updateNote = createAsyncThunk(
	'noteApp/noteDialogue/updateNote',
	async (payload, { dispatch, getState }) => {
		const { note, dismissDialogue } = payload;
		// Clearning old errors
		dispatch(setNewNoteDialogueErrors({}));

		const materialId = note.id;

		// --- Creating note material
		const createNotePayload = {
			title: note.title,
			description: note.description,
			serving_priority: note.serving_priority || 0,
			is_free: note.is_free
		};

		const promises = [];

		promises.push(
			axios
				.patch(`learning-material/${materialId}`, createNotePayload)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
		);

		// --- Binding Learning Material with Category

		if (note.file) {
			// Creating cancel request token
			const { CancelToken } = axiosDefault;
			axios.isCancel = axiosDefault.isCancel;
			const cancelToken = new CancelToken(c => {
				// An executor function receives a cancel function as a parameter
				window.axiosCancelReference = c;
			});

			const fileUploadPayload = new FormData();
			fileUploadPayload.append('file', note.file);
			let isUploadProgressSet = false;
			promises.push(
				axios
					.patch(`learning-material/note/${materialId}/file`, fileUploadPayload, {
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
						dispatch(setNewNoteDialogueErrors(dialogueErrors));
					})
			);
		}

		// -- Remove Old / Changed Category
		if (note.remove_category_id) {
			const bindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				axios
					.post(`/category/${note.remove_category_id}/unbind-learning-materials`, bindCategoryPayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- Binding Learning Material with Category
		if (note.category_id) {
			const bindCategoryPayload = { learning_material_ids: [materialId] };
			promises.push(
				axios
					.post(`/category/${note.category_id}/bind-learning-materials`, bindCategoryPayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		// --- Binding Learning Material with Package
		if (note.package_ids) {
			const bindPackagePayload = { package_ids: note.package_ids };
			promises.push(
				axios
					.put(`/learning-material/${materialId}/set-packages`, bindPackagePayload)
					.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			);
		}

		await Promise.all(promises);
		dispatch(showMessage({ message: 'Material updated successfully' }));
		if (dismissDialogue) {
			dispatch(closeEditNoteDialog());
		}
		dispatch(getNotes());
	}
);

export const openEditNoteDialog = createAsyncThunk(
	'noteApp/noteDialogue/openEditNoteDialog',
	async (materialId, { dispatch, getState, rejectWithValue }) => {
		const [learningMaterialNoteResponse, learningMaterialPackagesResponse] = await Promise.all([
			axios
				.get(`learning-material/note/${materialId}`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse)),
			axios
				.get(`learning-material/${materialId}/packages`)
				.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }))
		]);

		const learningMaterialNote = learningMaterialNoteResponse.data;
		const learningMaterialPackages = learningMaterialPackagesResponse.data;
		const packageIds = learningMaterialPackages.map(item => item.id);

		const editForm = {
			id: learningMaterialNote.learning_material_id,
			title: learningMaterialNote.title,
			description: learningMaterialNote.description,
			status_value: learningMaterialNote.learning_material_status_value,
			package_ids: packageIds,
			category_id: learningMaterialNote.category && learningMaterialNote.category.category_id,
			serving_priority: learningMaterialNote.serving_priority,
			is_free: learningMaterialNote.is_free
		};
		return editForm;
	}
);

const noteDialogueSlice = createSlice({
	name: 'noteApp/noteDialogue',
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
		errors: {}
	},
	reducers: {
		openNewNoteDialog: (state, action) => {
			state = {
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
				errors: {}
			};
			return state;
		},
		setNewNoteDialogueErrors: (state, action) => {
			state.errors = action.payload;
		},
		setUploadInProgress: (state, action) => {
			state.upload.inProgress = action.payload;
		},
		setUploadPercentage: (state, action) => {
			state.upload.percentage = action.payload;
		},
		cancelFileUpload: state => {
			if (window.axiosCancelReference) {
				window.axiosCancelReference();
			}
			state.upload = {
				inProgress: false,
				percentage: null,
				cancelled: true
			};
			state.submitting = false;
		},
		closeNewNoteDialog: state => {
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
		closeEditNoteDialog: (state, action) => {
			state.props.open = false;
		}
	},
	extraReducers: {
		[addNote.pending]: state => {
			state.submitting = true;
		},
		[addNote.fulfilled]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
		},
		[addNote.rejected]: state => {
			state.submitting = false;
			state.upload = {
				inProgress: false,
				percentage: null
			};
		},
		[openEditNoteDialog.pending]: state => {
			state = {
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
		[openEditNoteDialog.fulfilled]: (state, action) => {
			state.loading = false;
			state.form = action.payload;
		},
		[updateNote.pending]: state => {
			state.submitting = true;
		}
	}
});

export const {
	openNewNoteDialog,
	setNewNoteDialogueErrors,
	closeNewNoteDialog,
	closeEditNoteDialog,
	setUploadInProgress,
	setUploadPercentage,
	cancelFileUpload
	// openEditNoteDialog
} = noteDialogueSlice.actions;

export default noteDialogueSlice.reducer;
