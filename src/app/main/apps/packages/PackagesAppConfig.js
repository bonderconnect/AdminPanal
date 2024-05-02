import React from 'react';
import { authRoles } from 'app/auth';

const PackagesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/packages',
			component: React.lazy(() => import('./PackagesApp'))
		}
	]
};

export default PackagesAppConfig;
