import { combineReducers } from '@reduxjs/toolkit';
import attempts from './attempts';
import detail from './detail';

const reducer = combineReducers({
	attempts,
	detail
});

export default reducer;
