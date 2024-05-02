import { combineReducers } from '@reduxjs/toolkit';
import users from './usersSlice';
import customer from './customerSlice';
import filters from './filtersSlice';
import user from './user';

const reducer = combineReducers({
	users,
	customer,
	filters,
	user
});

export default reducer;
