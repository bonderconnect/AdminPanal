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
			path: '/apps/machineries-from-profiles',
			exact: true,
			component: React.lazy(() => import('./machineries/Machineries'))
		}
	]
};

export default StudentsAppConfig;
