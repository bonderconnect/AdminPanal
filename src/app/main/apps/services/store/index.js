import { combineReducers } from '@reduxjs/toolkit';
import services from './services';
import serviceDialog from './serviceDialog';

const reducer = combineReducers({
	services,
	serviceDialog
});

export default reducer;
