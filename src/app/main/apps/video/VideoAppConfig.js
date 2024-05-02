import i18next from 'i18next';
import React from 'react';
import { authRoles } from 'app/auth';
import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';

i18next.addResourceBundle('en', 'videoApp', en);
i18next.addResourceBundle('tr', 'videoApp', tr);
i18next.addResourceBundle('ar', 'videoApp', ar);

const VideoAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: ['/apps/material/videos'],
			component: React.lazy(() => import('./VideoApp'))
		},
		{
			path: '/apps/material/video/:learningMaterialId/:section?/:subSection?',
			component: React.lazy(() => import('./video/Video'))
		}
	]
};

export default VideoAppConfig;
