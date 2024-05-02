import React from 'react';
import { authRoles } from 'app/auth';

const StudentsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/agents',
			exact: true,
			component: React.lazy(() => import('./agents/Agents'))
		},
		{
			path: '/apps/agents/user/:userId/:section?/:subSection?',
			exact: true,
			component: React.lazy(() => import('./agent/Agent'))
		}
	]
};

export default StudentsAppConfig;
