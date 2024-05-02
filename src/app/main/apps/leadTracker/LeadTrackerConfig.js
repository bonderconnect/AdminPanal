import React from 'react';
import { authRoles } from 'app/auth';

const LeadTrackerConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/apps/lead-tracker',
			component: React.lazy(() => import('./LeadTracker'))
		}
	]
};

export default LeadTrackerConfig;
