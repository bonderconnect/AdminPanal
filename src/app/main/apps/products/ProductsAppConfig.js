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
			path: '/apps/products-from-profiles',
			exact: true,
			component: React.lazy(() => import('./products/Products'))
		}
	]
};

export default StudentsAppConfig;
