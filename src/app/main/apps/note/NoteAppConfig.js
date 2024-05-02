import i18next from 'i18next';
import React from 'react';
import { authRoles } from 'app/auth';
import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';

i18next.addResourceBundle('en', 'noteApp', en);
i18next.addResourceBundle('tr', 'noteApp', tr);
i18next.addResourceBundle('ar', 'noteApp', ar);

const NoteAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: ['/apps/material/notes/:MaterialId?'],
			component: React.lazy(() => import('./NoteApp'))
		},
		{
			path: '/apps/material/notes',
			component: () => React.lazy(() => import('./NoteApp'))
		}
	]
};

export default NoteAppConfig;
