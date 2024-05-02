import React from 'react';
import { authRoles } from 'app/auth';

const AdsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/ads',
			exact: true,
			component: React.lazy(() => import('./Ads'))
		}
		// {
		// 	path: '/apps/agents/user/:userId/:section?/:subSection?',
		// 	exact: true,
		// 	component: React.lazy(() => import('./agent/Agent'))
		// }
	]
};

export default AdsAppConfig;
