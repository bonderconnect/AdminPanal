import { combineReducers } from '@reduxjs/toolkit';
import exams from './examsSlice';
import videos from './videosSlice';

const reducer = combineReducers({
	exams,
	videos
});

export default reducer;
