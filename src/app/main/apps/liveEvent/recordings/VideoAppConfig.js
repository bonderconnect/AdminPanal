import React from 'react';
import { authRoles } from 'app/auth';

const VideoAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: ['/apps/live-event/recordings'],
			component: React.lazy(() => import('./VideoApp'))
		},
		{
			path: '/apps/live-event/recording/:learningMaterialId/:section?/:subSection?',
			component: React.lazy(() => import('./video/Video'))
		}
	]
};

export default VideoAppConfig;
