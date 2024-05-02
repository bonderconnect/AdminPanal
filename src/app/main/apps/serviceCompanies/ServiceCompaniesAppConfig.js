import React from 'react';
import { authRoles } from 'app/auth';

const TruckDriverAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/service-company-profiles',
			exact: true,
			component: React.lazy(() => import('./ServiceCompanies/ServiceCompanies'))
		}
	]
};

export default TruckDriverAppConfig;
