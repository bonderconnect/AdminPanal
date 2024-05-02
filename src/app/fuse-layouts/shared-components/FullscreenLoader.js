import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

const FullscreenLoader = () => (
	<div className="flex flex-1 items-center justify-center">
		<Typography variant="h5" gutterBottom>
			Loading ...
		</Typography>
		<CircularProgress className="ml-16" size={26} color="inherit" />
	</div>
);

export default FullscreenLoader;
