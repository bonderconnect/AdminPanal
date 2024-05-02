import React, { useEffect, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import FullscreenLoader from 'app/fuse-layouts/shared-components/FullscreenLoader';
import reducer from '../store';
import { getUserProfileData, resetProfile } from '../store/user/profileSlice';
import { reset as resetUserAnalyticsExam } from '../store/user/analytics/examsSlice';
import { reset as resetUserAnalyticsVideo } from '../store/user/analytics/videosSlice';
import ProfileTab from './ProfileTab';
import AnalyticsTab from './AnalyticsTab';
import { CustomerProfileTab } from './CustomerProfileTab';
import AgentProfileTab from './AgentProfileTab';
import TruckDriverProfile from './TruckDriverProfileTab';
import ServiceProfileTab from './ServiceProfileTab';
import { ConstructionMaterialsProfileTab } from './ConstructionMaterialsProfileTab.js';
import { MachineryProfileTab } from './MachineryProfileTab';
import { getAgentProfileData } from '../../agents/store/agent/profileSlice';

const useStyles = makeStyles(theme => ({
	avatar: {
		border: `4px solid ${theme.palette.background.default}`
	},
	root: {
		backgroundColor: '#fafafa'
	},
	topBg: {
		backgroundSize: 'cover!important',
		backgroundPosition: 'center center!important'
	},
	layoutHeader: {
		background: 'none',
		height: 164
	},
	tabs: {
		'& .MuiTab-root ': {
			color: theme.palette.primary.main
		}
	}
}));

function User() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(state => state.usersApp.user.profile.data);
	// console.log(`🚀  User  user:`, user);
	const params = useParams();
	const [selectedTab, setSelectedTab] = useState(null);
	const { userId, section, subSection } = params;

	function handleTabChange(__, value) {
		setSelectedTab(value);
	}

	function handleShowAllUsers() {
		setTimeout(() => {
			history.push('/apps/users');
		}, 0);
	}

	useEffect(() => {
		if (userId) {
			dispatch(getUserProfileData(userId));
		}

		return () => {
			dispatch(resetProfile());
			dispatch(resetUserAnalyticsExam());
			dispatch(resetUserAnalyticsVideo());
		};
	}, [userId]);

	useEffect(() => {
		let selectedTabValue = 0;
		switch (section) {
			case 'basic':
				selectedTabValue = 0;
				break;

			case 'customer':
				selectedTabValue = 1;
				break;
			case 'agent':
				selectedTabValue = 2;
				break;
			case 'driver':
				selectedTabValue = 3;
				break;
			case 'service':
				selectedTabValue = 4;
				break;
			case 'construction':
				selectedTabValue = 5;
				break;
			case 'machinery':
				selectedTabValue = 6;
				break;

			default:
				break;
		}

		console.log('section:', section);

		setSelectedTab(selectedTabValue);
	}, [section, subSection]);

	return user ? (
		<FusePageSimple
			classes={{
				root: classes.root,
				topBg: classes.topBg,
				header: classes.layoutHeader,
				wrapper: 'bg-transparent',
				content: 'w-full max-w-4xl mx-auto',
				toolbar: 'w-full max-w-4xl mx-auto relative flex flex-col min-h-auto h-auto items-start'
			}}
			header={
				<div className="w-full max-w-4xl items-start mx-auto flex">
					<Button
						onClick={handleShowAllUsers}
						color="primary"
						variant="outlined"
						size="small"
						className="mt-24"
						startIcon={<Icon>arrow_back</Icon>}
					>
						Show all users
					</Button>
				</div>
			}
			contentToolbar={
				<>
					<div className="w-full px-24 pb-48 flex flex-col md:flex-row flex-1 items-center">
						<Avatar
							className={clsx(classes.avatar, '-mt-64  w-128 h-128')}
							src="assets/images/avatars/profile.jpg"
						/>
						<div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
							<Typography
								className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
								variant="h4"
								color="inherit"
							>
								{(user.profile_fields && user.user_id) || `User / ${user.userId}`}
							</Typography>
						</div>
					</div>
					<Tabs
						value={selectedTab}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons="off"
						className={clsx('w-full px-24 -mx-4 min-h-40', classes.tabs)}
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: <Divider className="w-full h-full rounded-full opacity-50" />
						}}
					>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/basic`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Basic"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/customer`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Customer"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/agent`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Agent"
						/>

						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/driver`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Driver"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/service`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Service"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/construction`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Construction"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/users/user/${userId}/machinery`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 "
							disableRipple
							label="Machinery"
						/>
					</Tabs>
				</>
			}
			content={
				<div className="p-16 sm:p-24 h-full">
					<>
						{selectedTab === 0 && <ProfileTab />}
						{selectedTab === 1 && <CustomerProfileTab />}
						{selectedTab === 2 && <AnalyticsTab />}
						{selectedTab === 3 && <TruckDriverProfile />}
						{selectedTab === 4 && <ServiceProfileTab />}
						{selectedTab === 5 && <ConstructionMaterialsProfileTab />}
						{selectedTab === 6 && <MachineryProfileTab />}
					</>
				</div>
			}
		/>
	) : (
		<FullscreenLoader />
	);
}

export default withReducer('usersApp', reducer)(User);
