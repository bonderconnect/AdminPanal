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
			path: '/apps/services-from-profiles',
			exact: true,
			component: React.lazy(() => import('./services/Services'))
		}
	]
};

export default StudentsAppConfig;
