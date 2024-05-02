import React, { useEffect, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
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
import reducer from '../../store/recordings';
import { getVideo, reset as resetVideoDetail } from '../../store/recordings/video/detail';
import { reset as resetVideoWatchLogs } from '../../store/recordings/video/watchLogs';
import DetailTab from './DetailTab';
import WatchLogsTab from './WatchLogsTab';

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
		height: 'auto !important'
	},
	tabs: {
		'& .MuiTab-root ': {
			color: theme.palette.primary.main
		}
	}
}));

function Video() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const { data: video } = useSelector(state => state.liveEventApp.recordings.video.detail);
	const params = useParams();
	const [selectedTab, setSelectedTab] = useState(null);
	const { learningMaterialId, section, subSection } = params;

	function handleTabChange(__, value) {
		setSelectedTab(value);
	}

	function handleShowAllExams() {
		setTimeout(() => {
			history.push('/apps/material/videos');
		}, 0);
	}

	useEffect(() => {
		if (learningMaterialId) {
			dispatch(getVideo(learningMaterialId));
		}

		return () => {
			dispatch(resetVideoDetail());
			dispatch(resetVideoWatchLogs());
		};
	}, [learningMaterialId]);

	useEffect(() => {
		let selectedTabValue;
		switch (section) {
			case 'detail':
				selectedTabValue = 0;
				break;
			case 'watch-logs':
				selectedTabValue = 1;
				break;

			default:
				break;
		}

		setSelectedTab(selectedTabValue);
	}, [section, subSection]);

	return video ? (
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
						onClick={handleShowAllExams}
						color="primary"
						variant="outlined"
						size="small"
						className="mt-24"
						startIcon={<Icon>arrow_back</Icon>}
					>
						Show all videos
					</Button>
				</div>
			}
			contentToolbar={
				<>
					<div className="w-full px-24 pb-48 flex flex-col md:flex-row flex-1 items-center">
						<div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
							<Typography
								className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
								variant="h4"
								color="inherit"
							>
								{video.title}
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
							to={`/apps/material/video/${learningMaterialId}/detail`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Detail"
						/>
						<Tab
							component={RouterLink}
							to={`/apps/material/video/${learningMaterialId}/watch-logs`}
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Watch logs"
						/>
					</Tabs>
				</>
			}
			content={
				<div className="p-16 sm:p-24 h-full">
					<>
						{selectedTab === 0 && <DetailTab />}
						{selectedTab === 1 && <WatchLogsTab />}
					</>
				</div>
			}
		/>
	) : (
		<FullscreenLoader />
	);
}

export default withReducer('liveEventApp/recordings', reducer)(Video);
