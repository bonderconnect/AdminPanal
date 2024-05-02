import { combineReducers } from '@reduxjs/toolkit';
import truckDrivers from './truckDrivers';
import truckDriverDialog from './truckDriverDialog';

const reducer = combineReducers({
	truckDrivers,
	truckDriverDialog
});

export default reducer;
