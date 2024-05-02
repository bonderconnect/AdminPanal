import React from 'react';
import { authRoles } from 'app/auth';

const LiveEventAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/live-event/schedule',
			exact: true,
			component: React.lazy(() => import('./schedules'))
		},
		{
			path: '/apps/live-event/recordings',
			exact: true,
			component: React.lazy(() => import('./recordings/VideoApp'))
		}
	]
};

export default LiveEventAppConfig;
