import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import { AgentProfileReferralEarningsTab } from 'app/main/apps/agents/agent/AgentProfileReferralEarningsTab';
import { AgentProfileReferralsTab } from 'app/main/apps/agents/agent/AgentProfileReferralsTab';
import ProfileTab from 'app/main/apps/agents/agent/ProfileTab';
import { Divider } from '@material-ui/core';
import clsx from 'clsx';

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
	const [selectedTab, setSelectedTab] = useState(1);
	const { userId, section, subSection } = params;

	function handleTabChange(__, value) {
		setSelectedTab(value);
	}

	useEffect(() => {
		let selectedTabValue = 1;
		switch (subSection) {
			case 'profile':
				selectedTabValue = 0;
				break;

			case 'earnings':
				selectedTabValue = 1;
				break;
			case 'referrals':
				selectedTabValue = 2;
				break;

			default:
				break;
		}

		// console.log('section:', section, subSection);

		setSelectedTab(selectedTabValue);
	}, [section, subSection]);

	return userId ? (
		<div className="md:flex max-w-4xl h-full">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 h-full">
				{/* <Paper square> */}
				<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="inherit"
					variant="scrollable"
					scrollButtons="off"
					className={clsx('w-full px-24 -mx-4 min-h-40', classes.tabs)}
					classes={{ indicator: 'flex justify-center bg-transparent w-full h-full p-4' }}
					TabIndicatorProps={{
						children: <Divider className="w-full h-full rounded-full opacity-50" />
					}}
				>
					<Tab
						component={RouterLink}
						to={`/apps/users/user/${userId}/${section}/profile`}
						disableRipple
						label="Profile"
					/>
					<Tab
						component={RouterLink}
						to={`/apps/users/user/${userId}/${section}/earnings`}
						disableRipple
						label="earnings"
					/>
					<Tab
						component={RouterLink}
						to={`/apps/users/user/${userId}/${section}/referrals`}
						disableRipple
						label="referrals"
					/>
				</Tabs>
				{/* </Paper> */}
				{/* {console.log('selectedTab:', selectedTab)} */}
				{selectedTab === 0 && <ProfileTab />}
				{selectedTab === 1 && <AgentProfileReferralEarningsTab />}
				{selectedTab === 2 && <AgentProfileReferralsTab />}
			</div>
		</div>
	) : null;
};

export default AnalyticsTab;
