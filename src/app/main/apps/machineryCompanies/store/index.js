import { combineReducers } from '@reduxjs/toolkit';
import machineryCompanies from './machineryCompanies';
import machineryCompanyDialog from './machineryCompanyDialog';

const reducer = combineReducers({
	machineryCompanies,
	machineryCompanyDialog
});

export default reducer;
