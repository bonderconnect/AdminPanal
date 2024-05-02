import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';
// eslint-disable-next-line import/no-cycle
import { publishNote, unpublishNote, getNoteLink } from './noteSlice';

export const getNotes = createAsyncThunk('noteApp/notes/getNotes', async (params, { dispatch, getState }) => {
	params = params || getState().noteApp.notes.params;
	dispatch(getNotesCount(params));
	dispatch(setNotesParams(params));
	const response = await axios
		.get('/learning-material/notes', { params })
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const responseData = await response.data;
	const data = responseData.length
		? responseData.map(item => ({ ...item, id: item.learning_material_id }))
		: responseData;
	const loading = false;
	return { data, loading };
});

export const getNotesCount = createAsyncThunk('noteApp/notes/getNotesCount', async (params, { getState }) => {
	params = params || getState().noteApp.notes.params;
	const updatedParams = { ...params };
	delete updatedParams.page;
	delete updatedParams.limit;
	const response = await axios
		.get('/learning-material/notes/count', { params: updatedParams })
		.then(helpers.parseApiResponse);
	const data = await response.data;

	return data;
});

export const duplicateNote = createAsyncThunk('noteApp/note/duplicateNote', async (materialId, { dispatch }) => {
	dispatch(setItemsDuplicationInProgress(materialId));
	await axios.post(`/learning-material/${materialId}/duplicate`);

	dispatch(showMessage({ message: 'note duplicated successfully!' }));
	dispatch(getNotes());
});

const notesAdapter = createEntityAdapter({});

export const { selectAll: selectNotes, selectById: selectNoteById } = notesAdapter.getSelectors(
	state => state.noteApp.notes
);

const notesSlice = createSlice({
	name: 'noteApp/notes',
	initialState: notesAdapter.getInitialState({
		searchText: '',
		loading: false,
		params: {
			page: 1,
			limit: 10,
			sort_by: 'created_date',
			sort_dir: 'desc'
		},
		count: null,
		itemDuplicationInProgress: [],
		itemsStatusInChangeProgress: [] // To show progress in publishing / unpublishing
	}),
	reducers: {
		setNotesSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setNotesParams: (state, action) => {
			state.params = action.payload;
		},
		setNotesLoading: (state, action) => {
			state.loading = action.payload;
		},
		setNotesCount: (state, action) => {
			state.count = action.payload;
		},
		setItemsStatusInChangeProgress: (state, action) => {
			state.itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress, action.payload];
		},
		setItemsDuplicationInProgress: (state, action) => {
			state.itemDuplicationInProgress = [...state.itemDuplicationInProgress, action.payload];
		}
	},
	extraReducers: {
		[getNotes.fulfilled]: (state, action) => {
			const { data, params, loading } = action.payload;
			notesAdapter.setAll(state, data);
			state.loading = loading;
			state.searchText = '';
		},
		[getNotes.pending]: (state, action) => {
			state.loading = true;
		},
		[getNotesCount.fulfilled]: (state, action) => {
			state.count = action.payload;
		},
		[getNoteLink.pending]: (state, action) => {
			notesAdapter.updateOne(state, { id: action.meta.arg, changes: { loading_link: true } });
		},
		[getNoteLink.fulfilled]: (state, action) => {
			const { payload } = action;
			notesAdapter.updateOne(state, {
				id: payload.materialId,
				changes: { loading_link: false, link: payload.data }
			});
		},
		[publishNote.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			notesAdapter.updateOne(state, { id: materialId, changes: { status_value: 1 } });
		},
		[unpublishNote.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			notesAdapter.updateOne(state, { id: materialId, changes: { status_value: 0 } });
		},
		[duplicateNote.fulfilled]: (state, action) => {
			const itemDuplicationInProgress = [...state.itemDuplicationInProgress];
			const materialId = action.payload;
			const foundIndex = itemDuplicationInProgress.indexOf(materialId);
			itemDuplicationInProgress.splice(foundIndex, 1);
			state.itemDuplicationInProgress = itemDuplicationInProgress;
		}
	}
});

export const {
	setNotesParams,
	setNotesSearchText,
	setItemsStatusInChangeProgress,
	setItemsDuplicationInProgress
} = notesSlice.actions;

export default notesSlice.reducer;
