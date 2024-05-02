import React from 'react';
import { authRoles } from 'app/auth';

const ConstructionMaterialsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/categories/construction-materials',
			component: React.lazy(() => import('./CategoriesConstructionMaterialsApp'))
		}
	]
};

export default ConstructionMaterialsAppConfig;
