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
			path: '/apps/truck-drivers',
			exact: true,
			component: React.lazy(() => import('./truckDrivers/TruckDrivers'))
		}
	]
};

export default TruckDriverAppConfig;
