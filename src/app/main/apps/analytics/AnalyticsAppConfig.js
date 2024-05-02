import i18next from 'i18next';
import React from 'react';
import { authRoles } from 'app/auth';
import en from './i18n/en';

i18next.addResourceBundle('en', 'videoApp', en);

const AnalyticsAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: ['/apps/analytics'],
			exact: true,
			component: React.lazy(() => import('./AnalyticsApp'))
		},
		{
			path: ['/apps/analytics/videos-watch'],
			exact: true,
			component: React.lazy(() => import('./AnalyticsVideosWatch'))
		},
		{
			path: ['/apps/analytics/exams-attempts'],
			exact: true,
			component: React.lazy(() => import('./AnalyticsExamsAttempts'))
		}
	]
};

export default AnalyticsAppConfig;
