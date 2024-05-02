import { combineReducers } from '@reduxjs/toolkit';
import watchLogs from './watchLogs';
import detail from './detail';

const reducer = combineReducers({
	watchLogs,
	detail
});

export default reducer;
