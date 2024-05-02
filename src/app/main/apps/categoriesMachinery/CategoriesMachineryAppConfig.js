import React from 'react';
import { authRoles } from 'app/auth';

const MachineryAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/categories/machinery',
			component: React.lazy(() => import('./CategoriesMachineryApp'))
		}
	]
};

export default MachineryAppConfig;
