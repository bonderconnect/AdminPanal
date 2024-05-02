import React from 'react';
import { authRoles } from 'app/auth';

const CategoriesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/categories',
			component: React.lazy(() => import('./CategoriesApp'))
		}
	]
};

export default CategoriesAppConfig;
