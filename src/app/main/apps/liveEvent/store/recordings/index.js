import { combineReducers } from '@reduxjs/toolkit';
import categories from './categorySlice';
import packages from './packageSlice';
import video from './video';
import videos from './videosSlice';
import videoDialogue from './videoDialogueSlice';
import videoPreview from './videoPreviewSlice';

const reducer = combineReducers({
	packages,
	categories,
	videos,
	video,
	videoDialogue,
	videoPreview
});

export default reducer;
