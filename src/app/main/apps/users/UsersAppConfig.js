import React from 'react';
import { authRoles } from 'app/auth';

const UsersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/users',
			exact: true,
			component: React.lazy(() => import('./users/Users'))
		},
		{
			path: '/apps/users/user/:userId/:section?/:subSection?',
			exact: true,
			component: React.lazy(() => import('./user/User'))
		}
	]
};

export default UsersAppConfig;
