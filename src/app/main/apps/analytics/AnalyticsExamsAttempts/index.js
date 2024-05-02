import FusePageCarded from '@fuse/core/FusePageCarded';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import withReducer from 'app/store/withReducer';
import AnalyticsExamsAttemptsContent from './AnalyticsExamsAttemptsContent';
import AnalyticsExamsAttemptsHeader from './AnalyticsExamsAttemptsHeader';
import reducer from '../store';

const useStyles = makeStyles({
	layoutRoot: {}
});

function AnalyticsVideosWatch() {
	const classes = useStyles();

	return (
		<FusePageCarded
			classes={{
				root: classes.layoutRoot
			}}
			header={<AnalyticsExamsAttemptsHeader />}
			content={<AnalyticsExamsAttemptsContent />}
		/>
	);
}

export default withReducer('analyticsApp', reducer)(AnalyticsVideosWatch);
