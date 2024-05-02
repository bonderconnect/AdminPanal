import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { openNewLiveEventDialog } from '../store/liveEventDialog';

function SchedulesHeader(props) {
	const dispatch = useDispatch();
	const dateRange = useSelector(state => state.liveEventApp.schedule.calendar.dateRange);
	const loading = useSelector(state => state.liveEventApp.schedule.calendar.loading);

	const handleNewLiveEvent = () => {
		dispatch(openNewLiveEventDialog());
	};

	const { calendarRef } = props;
	const calendarApi = () => calendarRef.current && calendarRef.current.getApi();

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-1 items-center">
				<div className="flex items-center">
					<Icon className="text-32">today</Icon>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						Live event schedules
					</Typography>
				</div>
			</div>

			<div className="flex flex-1 justify-center items-center">
				<Tooltip title="Previous">
					<IconButton aria-label="Previous" onClick={() => calendarApi().prev()}>
						<Icon>chevron_left</Icon>
					</IconButton>
				</Tooltip>
				<Typography variant="h6">{dateRange && dateRange.view.title}</Typography>
				<Tooltip title="Next">
					<IconButton aria-label="Next" onClick={() => calendarApi().next()}>
						<Icon>chevron_right</Icon>
					</IconButton>
				</Tooltip>
			</div>

			<div className="flex flex-1 items-center justify-end px-8 sm:px-12">
				{loading ? (
					<Box className="flex flex-1 items-center justify-end pr-24">
						<span className="pr-8">Loading...</span>
						<CircularProgress size={26} />
					</Box>
				) : null}
				<Button onClick={handleNewLiveEvent} variant="contained" color="secondary" startIcon={<Icon>add</Icon>}>
					New Live Event
				</Button>
			</div>
		</div>
	);
}

export default SchedulesHeader;
