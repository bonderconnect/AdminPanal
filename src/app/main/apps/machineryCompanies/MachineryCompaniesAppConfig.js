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
			path: '/apps/machinery-company-profiles',
			exact: true,
			component: React.lazy(() => import('./MachineryCompanies/MachineryCompanies'))
		}
	]
};

export default TruckDriverAppConfig;
