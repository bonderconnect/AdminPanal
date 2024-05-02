import { combineReducers } from '@reduxjs/toolkit';
import agents from './agents';
import agentDialog from './agentDialog';
import agent from './agent';

const reducer = combineReducers({
	agents,
	agentDialog,
	agent
});

export default reducer;
