import React from 'react';
import { authRoles } from 'app/auth';

const FacultiesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/faculties',
			exact: true,
			component: React.lazy(() => import('./faculties/Faculties'))
		}
	]
};

export default FacultiesAppConfig;
