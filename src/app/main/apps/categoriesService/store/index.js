import { combineReducers } from '@reduxjs/toolkit';
import categoriesService from './CategoriesServiceSlice';

const reducer = combineReducers({
	categoriesService
});

export default reducer;
