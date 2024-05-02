import i18next from 'i18next';
import React from 'react';
import { authRoles } from 'app/auth';
import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';

i18next.addResourceBundle('en', 'examApp', en);
i18next.addResourceBundle('tr', 'examApp', tr);
i18next.addResourceBundle('ar', 'examApp', ar);

const ExamAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/material/exams',
			exact: true,
			component: React.lazy(() => import('./exams/Exams'))
		},
		{
			path: '/apps/material/exam/:learningMaterialId/questions',
			component: React.lazy(() => import('./examQuestions/Exam'))
		},
		{
			path: '/apps/material/exam/:learningMaterialId/questions-management',
			component: React.lazy(() => import('./questions'))
		},
		{
			path: '/apps/material/exam/:learningMaterialId/:section?/:subSection?',
			exact: true,
			component: React.lazy(() => import('./exam/Exam'))
		},
		{
			path: '/apps/material/exam/:learningMaterialId/attempts/:attemptId/evaluate',
			exact: true,
			component: React.lazy(() => import('./evaluation'))
		}
	]
};

export default ExamAppConfig;
