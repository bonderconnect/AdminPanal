import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import StarIcon from '@material-ui/icons/Star';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TodayIcon from '@material-ui/icons/Today';
import * as Icons from '@material-ui/icons';
import DoneIcon from '@material-ui/icons/Done';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const useStyles = makeStyles(theme => ({
	root1: {
		width: '100%'
	},
	sidebarStyle: {
		borderRadius: '0px 30px 30px 0px'
	},
	activeFilterItem: {
		backgroundColor: '#61dafb',
		color: 'rgba(0, 0, 0, 0.87) !important',
		'&:hover': {
			background: '#61dafb'
		}
	}
}));

const Filter = () => {
	const classes = useStyles();
	const [selected, setSelected] = useState('starred');
	const filters = [
		{
			title: 'Starred',
			icon: 'Star',
			name: 'starred'
		},
		{
			title: 'Priority',
			icon: 'Error',
			name: 'priority'
		},
		{
			title: 'Scheduled',
			icon: 'Schedule',
			name: 'scheduled'
		},
		{
			title: 'Today',
			icon: 'Today',
			name: 'today'
		},
		{
			title: 'Done',
			icon: 'Done',
			name: 'done'
		},
		{
			title: 'Deleted',
			icon: 'DeleteOutline',
			name: 'deleted'
		}
	];
	return (
		<List
			component="nav"
			aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					FILTERS
				</ListSubheader>
			}
			className={classes.root1}
		>
			{filters.map(filterItem => {
				const IconComponent = Icons[filterItem.icon];
				return (
					<ListItem
						key={`_${filterItem.name}`}
						button
						onClick={() => setSelected(filterItem.name)}
						className={clsx(
							classes.sidebarStyle,
							filterItem.name === selected ? classes.activeFilterItem : undefined
						)}
					>
						<ListItemIcon>
							<IconComponent />
						</ListItemIcon>
						<ListItemText primary={filterItem.title} />
					</ListItem>
				);
			})}
		</List>
	);
};

export default Filter;
