import { combineReducers } from '@reduxjs/toolkit';
import schedule from './schedule';
import liveEventDialog from './liveEventDialog';
import liveEventGoLiveDialog from './liveEventGoLiveDialog';
import recordings from './recordings';

const reducer = combineReducers({
	schedule,
	liveEventDialog,
	liveEventGoLiveDialog,
	recordings
});

export default reducer;
