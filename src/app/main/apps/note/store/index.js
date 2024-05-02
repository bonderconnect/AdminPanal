import { combineReducers } from '@reduxjs/toolkit';
import categories from './categorySlice';
import packages from './packageSlice';
import note from './noteSlice';
import notes from './notesSlice';
import noteDialogue from './noteDialogueSlice';

const reducer = combineReducers({
	packages,
	categories,
	notes,
	note,
	noteDialogue
});

export default reducer;
