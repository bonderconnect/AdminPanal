import { combineReducers } from '@reduxjs/toolkit';
import categories from './categoriesSlice';
import categoryTypes from './categoryTypesSlice';

const reducer = combineReducers({
	categories,
	categoryTypes
});

export default reducer;
