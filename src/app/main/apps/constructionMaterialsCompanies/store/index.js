import { combineReducers } from '@reduxjs/toolkit';
import constructionMaterialsCompanies from './constructionMaterialsCompanies';
import constructionMaterialsCompanyDialog from './constructionMaterialsCompanyDialog';

const reducer = combineReducers({
	constructionMaterialsCompanies,
	constructionMaterialsCompanyDialog
});

export default reducer;
