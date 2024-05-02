import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setVideosParams } from '../../store/recordings/videosSlice';
import VideosToolbarPagination from './VideosToolbarPagination';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	directionControl: {},
	margin: {
		margin: theme.spacing(1)
	},
	sortSelect: {
		'& .MuiSelect-selectMenu': {
			padding: '8px',
			textAlign: 'center'
		},
		'& .MuiSelect-icon': {
			display: 'none'
		}
	},
	sortDirIcon: {
		color: '#000000'
	}
}));

function VideoToolbar(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { params, count, loading } = useSelector(({ liveEventApp }) => liveEventApp.recordings.videos);

	const goToPage = nextPageIndex => {
		dispatch(setVideosParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		dispatch(setVideosParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const onSortByChange = ev => {
		dispatch(setVideosParams({ ...params, sort_by: ev.target.value }));
	};

	const onSortDirChange = ev => {
		dispatch(setVideosParams({ ...params, sort_dir: params.sort_dir === 'desc' ? 'asc' : 'desc' }));
	};

	return (
		<div className="flex flex-1 items-center sm:px-8">
			<div className="flex justify-start items-center pl-16 flex-1">
				<Typography variant="body" display="block" gutterBottom>
					Sort by :
				</Typography>

				<FormControl variant="outlined" className={classes.formControl}>
					<Select
						labelId="videos-sort-select-label"
						id="videos-sort-select"
						className={classes.sortSelect}
						value={params.sort_by}
						onChange={onSortByChange}
					>
						<MenuItem value="created_date">Created date</MenuItem>
						<MenuItem value="serving_priority">Serving priority</MenuItem>
					</Select>
				</FormControl>
				<div className="flex flex-col">
					<IconButton size="small" onClick={onSortDirChange} aria-label="delete" className={classes.margin}>
						{params.sort_dir === 'desc' ? (
							<ArrowDownwardIcon fontSize="small" className={classes.sortDirIcon} />
						) : null}
						{params.sort_dir === 'asc' ? (
							<ArrowUpwardIcon fontSize="small" className={classes.sortDirIcon} />
						) : null}
					</IconButton>
				</div>
			</div>
			<div className="flex justify-center flex-1">
				{loading && (
					<Box className="flex flex-1 items-center pl-24">
						<span className="pr-8">Loading...</span>
						<CircularProgress size={26} />
					</Box>
				)}
			</div>
			<VideosToolbarPagination
				goToPage={goToPage}
				onRowsLimitChange={onRowsLimitChange}
				count={count}
				pageIndex={params.page - 1}
				limit={params.limit}
			/>
		</div>
	);
}

export default VideoToolbar;
