import { combineReducers } from '@reduxjs/toolkit';
import videosWatch from './videosWatchSlice';
import examsAttempts from './examsAttemptsSlice';

const reducer = combineReducers({
	videosWatch,
	examsAttempts
});

export default reducer;
