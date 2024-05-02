import { combineReducers } from '@reduxjs/toolkit';
import faculties from './faculties';
import facultyDialog from './facultyDialog';

const reducer = combineReducers({
	faculties,
	facultyDialog
});

export default reducer;
