import React from 'react';
import { authRoles } from 'app/auth';

const ServiceAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/categories/service',
			component: React.lazy(() => import('./CategoriesServiceApp'))
		}
	]
};

export default ServiceAppConfig;
