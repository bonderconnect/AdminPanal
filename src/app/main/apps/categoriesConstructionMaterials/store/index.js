import { combineReducers } from '@reduxjs/toolkit';
import categoriesConstructionMaterials from './CategoriesConstructionMaterialsSlice';

const reducer = combineReducers({
	categoriesConstructionMaterials
});

export default reducer;
