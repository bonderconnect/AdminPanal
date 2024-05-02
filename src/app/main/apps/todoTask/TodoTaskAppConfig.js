import i18next from 'i18next';
import React from 'react';
import { authRoles } from 'app/auth';

const TodoTaskConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.faculty,
	routes: [
		{
			path: '/apps/todo-task',
			component: React.lazy(() => import('./TodoTaskApp'))
		}
	]
};

export default TodoTaskConfig;
