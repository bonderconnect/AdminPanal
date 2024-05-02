import React from 'react';
import { authRoles } from 'app/auth';

const StudentsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/customers',
			exact: true,
			component: React.lazy(() => import('./customers/Customers'))
		}
	]
};

export default StudentsAppConfig;
