import { combineReducers } from '@reduxjs/toolkit';
import packages from './packagesSlice';

const reducer = combineReducers({
	packages
});

export default reducer;
