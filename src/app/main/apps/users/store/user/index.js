import { combineReducers } from '@reduxjs/toolkit';
import profile from './profileSlice';
import analytics from './analytics';

const reducer = combineReducers({
	profile,
	analytics
});

export default reducer;
