import { combineReducers } from '@reduxjs/toolkit';
import customers from './customers';
import customerDialog from './customerDialog';

const reducer = combineReducers({
	customers,
	customerDialog
});

export default reducer;
