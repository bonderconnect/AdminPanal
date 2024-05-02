import { combineReducers } from '@reduxjs/toolkit';
import products from './products';
import productDialog from './productDialog';

const reducer = combineReducers({
	products,
	productDialog
});

export default reducer;
