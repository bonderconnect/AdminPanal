import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import AnalyticsExam from './AnalyticsExam';
import AnalyticsVideo from './AnalyticsVideo';

const useStyles = makeStyles(theme => ({
	tabs: {
		'& .MuiTab-root ': {
			color: theme.palette.primary.main
		}
	}
}));

const AnalyticsTab = () => {
	const params = useParams();
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(null);
	const { userId, subSection } = params;

	useEffect(() => {
		let selectedTabValue;
		switch (subSection) {
			case 'exams':
				selectedTabValue = 0;
				break;

			case 'videos':
				selectedTabValue = 1;
				break;

			default:
				break;
		}

		setSelectedTab(selectedTabValue);
	}, [subSection]);

	return userId ? (
		<div className="md:flex max-w-4xl h-full">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 h-full">
				<Paper square>
					<Tabs
						value={selectedTab}
						className={classes.tabs}
						indicatorColor="primary"
						textColor="primary"
						aria-label="disabled tabs example"
					>
						<Tab
							component={RouterLink}
							to={`/apps/agents/user/${userId}/analytics/exams`}
							disableRipple
							label="REFERRALS"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/agents/user/${userId}/analytics/videos`}
							disableRipple
							label="EARNINGS"
						/>
					</Tabs>
				</Paper>
				{selectedTab === 0 ? <AnalyticsExam /> : null}
				{selectedTab === 1 ? <AnalyticsVideo /> : null}
			</div>
		</div>
	) : null;
};

export default AnalyticsTab;
