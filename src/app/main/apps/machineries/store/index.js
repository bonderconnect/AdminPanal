import { combineReducers } from '@reduxjs/toolkit';
import machineries from './machineries';
import machineryDialog from './machineryDialog';

const reducer = combineReducers({
	machineries,
	machineryDialog
});

export default reducer;
