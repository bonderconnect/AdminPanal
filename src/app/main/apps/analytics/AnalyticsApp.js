import FusePageCarded from '@fuse/core/FusePageCarded';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
	layoutRoot: {}
});

function AnalyticsApp() {
	const classes = useStyles();

	return (
		<FusePageCarded
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="py-24">
					<h4>Analytics</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Content</h4>
					<br />
				</div>
			}
		/>
	);
}

export default AnalyticsApp;
