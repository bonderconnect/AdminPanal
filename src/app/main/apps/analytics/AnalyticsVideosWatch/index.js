import FusePageCarded from '@fuse/core/FusePageCarded';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import withReducer from 'app/store/withReducer';
import AnalyticsVideosWatchContent from './AnalyticsVideosWatchContent';
import AnalyticsVideosWatchHeader from './AnalyticsVideoWatchHeader';
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
			header={<AnalyticsVideosWatchHeader />}
			content={<AnalyticsVideosWatchContent />}
		/>
	);
}

export default withReducer('analyticsApp', reducer)(AnalyticsVideosWatch);
