import React from 'react';
import { authRoles } from 'app/auth';

const SubscriptionsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/subscriptions',
			component: React.lazy(() => import('./SubscriptionsApp'))
		}
	]
};

export default SubscriptionsAppConfig;
