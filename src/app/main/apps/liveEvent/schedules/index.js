import React, { useEffect, useRef, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from './header';
import { getSchedules, selectEvents, setDateRange } from '../store/schedule/calendar';
// import EventDialog from './EventDialog';
import reducer from '../store';
import LiveEventDialog from '../liveEventDialog';
import { openEditLiveEventDialog } from '../store/liveEventDialog';
import LiveEventGoLiveDialog from '../liveEventGoLiveDialog';
// import { selectEvents, openNewEventDialog, openEditEventDialog, updateEvent, getEvents } from './store/eventsSlice';

const useStyles = makeStyles(theme => ({
	root: {
		'& a': {
			color: theme.palette.text.primary,
			textDecoration: 'normal!important'
		},
		'&  .fc-media-screen': {
			minHeight: '100%'
		},
		'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
			borderColor: `${theme.palette.divider}!important`
		},
		'&  .fc-scrollgrid-section > td': {
			border: 0
		},
		'& .fc-daygrid-day': {
			'&:last-child': {
				borderRight: 0
			}
		},
		'& .fc-col-header-cell': {
			borderWidth: '0 0 1px 0',
			padding: '16px 0',
			'& .fc-col-header-cell-cushion': {
				color: theme.palette.text.secondary,
				fontWeight: 500
			}
		},
		'& .fc-view ': {
			borderRadius: 20,
			overflow: 'hidden',
			border: `1px solid ${theme.palette.divider}`,
			'& > .fc-scrollgrid': {
				border: 0
			}
		},
		'& .fc-daygrid-day-number': {
			color: theme.palette.text.secondary,
			fontWeight: 500
		},
		'& .fc-event': {
			backgroundColor: `${theme.palette.primary.dark}!important`,
			color: `${theme.palette.primary.contrastText}!important`,
			border: 0,
			padding: '0 6px',
			borderRadius: '16px!important'
		}
	},
	addButton: {
		position: 'absolute',
		right: 12,
		top: 172,
		zIndex: 99
	}
}));

function Schedules(props) {
	const dateRange = useSelector(state => state.liveEventApp.schedule.calendar.dateRange);
	const dispatch = useDispatch();
	const events = useSelector(selectEvents);
	const [calendarEvents, setCalendarEvents] = useState([]);
	const calendarRef = useRef();

	const classes = useStyles(props);
	const headerEl = useRef(null);

	useEffect(() => {
		const calendarEventsArr = events.map(item => ({
			title: item.title,
			start: item.start_time,
			end: item.end_time,
			allDay: false,
			id: item.live_event_id
		}));
		setCalendarEvents(calendarEventsArr);
	}, [events]);

	useEffect(() => {
		if (!dateRange) return;
		const startTime = dateRange.start;
		const endTime = dateRange.end;
		dispatch(getSchedules({ startTime, endTime }));
	}, [dispatch, dateRange]);

	const handleDateSelect = selectInfo => {
		const { start, end } = selectInfo;

		// dispatch(
		// 	openNewEventDialog({
		// 		start,
		// 		end
		// 	})
		// );
	};

	const handleEventDrop = eventDropInfo => {
		const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
		// dispatch(
		// 	updateEvent({
		// 		id,
		// 		title,
		// 		allDay,
		// 		start,
		// 		end,
		// 		extendedProps
		// 	})
		// );
	};
	const handleEventClick = clickInfo => {
		const { id: liveEventId } = clickInfo.event;
		dispatch(openEditLiveEventDialog(liveEventId));
	};

	const handleDates = rangeInfo => {
		const dateRangeObj = {
			start: rangeInfo.start.toISOString(),
			end: rangeInfo.end.toISOString(),
			view: {
				type: rangeInfo.view.type,
				title: rangeInfo.view.title
			}
		};
		dispatch(setDateRange(dateRangeObj));
	};

	const handleEventAdd = addInfo => {};

	const handleEventChange = changeInfo => {};

	const handleEventRemove = removeInfo => {};

	return (
		<>
			<div className={clsx(classes.root, 'flex flex-col flex-auto relative')}>
				<Header calendarRef={calendarRef} />
				<div className="flex flex-1 flex-col container">
					<div className="p-24 w-full">
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							headerToolbar={false}
							initialView="dayGridMonth"
							editable
							selectable
							selectMirror
							dayMaxEvents
							weekends
							datesSet={handleDates}
							select={handleDateSelect}
							events={calendarEvents}
							eventContent={renderEventContent}
							eventClick={handleEventClick}
							eventAdd={handleEventAdd}
							eventChange={handleEventChange}
							eventRemove={handleEventRemove}
							eventDrop={handleEventDrop}
							initialDate={new Date()}
							ref={calendarRef}
						/>
					</div>
				</div>
			</div>
			<LiveEventDialog />
			<LiveEventGoLiveDialog />
		</>
	);
}

function renderEventContent(eventInfo) {
	return (
		<div className="flex items-center">
			<Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
			<div className="grid auto-cols-fr">
				<Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
			</div>
		</div>
	);
}

export default withReducer('liveEventApp', reducer)(Schedules);
