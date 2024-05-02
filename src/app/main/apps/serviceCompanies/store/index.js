import { combineReducers } from '@reduxjs/toolkit';
import serviceCompanies from './serviceCompanies';
import serviceCompanyDialog from './serviceCompanyDialog';

const reducer = combineReducers({
	serviceCompanies,
	serviceCompanyDialog
});

export default reducer;
