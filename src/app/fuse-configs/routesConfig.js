import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import LoginConfig from 'app/main/login/LoginConfig';

const routeConfigs = [...appsConfigs, LoginConfig];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/apps/users" />
	}
];

export default routes;
