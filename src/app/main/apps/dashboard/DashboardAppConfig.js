import React from 'react';
import { authRoles } from 'app/auth';

const UsersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/dashboard',
			component: React.lazy(() => import('./DashboardApp'))
		}
	]
};

export default UsersAppConfig;
