import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import helpers from 'app/utils/helpers';
// eslint-disable-next-line import/no-cycle
import { getNotes, setItemsStatusInChangeProgress } from './notesSlice';

export const getNote = createAsyncThunk('noteApp/note/getNote', async params => {
	const response = await axios.get('/api/mail-app/mail', { params });
	const data = await response.data;
	return data;
});

export const publishNote = createAsyncThunk('noteApp/note/publishNote', async (materialId, { dispatch }) => {
	dispatch(setItemsStatusInChangeProgress(materialId));
	const response = await axios.patch(`/learning-material/note/${materialId}/publish`);
	const data = await response.data;

	dispatch(showMessage({ message: 'Note published' }));
	return materialId;
});

export const getNoteLink = createAsyncThunk('noteApp/note/getNoteLink', async materialId => {
	const response = await axios
		.get(`/learning-material/note/${materialId}/download-link`)
		.then(helpers.parseApiResponse);
	const data = await response.data;
	return { materialId, data };
});

export const unpublishNote = createAsyncThunk('noteApp/note/unpublishNote', async (materialId, { dispatch }) => {
	dispatch(setItemsStatusInChangeProgress(materialId));
	const response = await axios.patch(`/learning-material/note/${materialId}/unpublish`);
	const data = await response.data;

	dispatch(showMessage({ message: 'Note unpublished' }));
	return materialId;
});

export const updateNote = createAsyncThunk('noteApp/mail/updateNote', async (_data, { getState, dispatch }) => {
	const { id } = getState().noteApp.note;

	const response = await axios.post('/api/note-app/update-note', { id, ..._data });
	const data = await response.data;

	dispatch(showMessage({ message: 'Note Saved' }));

	return data;
});

export const removeNote = createAsyncThunk('noteApp/note/removeNote', async (materialId, { getState, dispatch }) => {
	await axios.delete(`/learning-material/${materialId}`);

	dispatch(showMessage({ message: 'Material Deleted' }));
	dispatch(getNotes());
});

const noteSlice = createSlice({
	name: 'noteApp/note',
	initialState: null,
	reducers: {},
	extraReducers: {
		[getNote.fulfilled]: (state, action) => action.payload,
		[updateNote.fulfilled]: (state, action) => ({
			...state,
			...action.payload
		})
	}
});

export default noteSlice.reducer;
