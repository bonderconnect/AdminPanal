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
			path: '/apps/construction-materials-company-profiles',
			exact: true,
			component: React.lazy(() => import('./ConstructionMaterialsCompanies/ConstructionMaterialsCompanies'))
		}
	]
};

export default TruckDriverAppConfig;
