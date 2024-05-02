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
import { setNotesParams } from '../store/notesSlice';
import NotesToolbarPagination from './NotesToolbarPagination';

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

function NoteToolbar(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { params, count, loading } = useSelector(({ noteApp }) => noteApp.notes);

	const goToPage = nextPageIndex => {
		dispatch(setNotesParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		dispatch(setNotesParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const onSortByChange = ev => {
		dispatch(setNotesParams({ ...params, sort_by: ev.target.value }));
	};

	const onSortDirChange = ev => {
		dispatch(setNotesParams({ ...params, sort_dir: params.sort_dir === 'desc' ? 'asc' : 'desc' }));
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
			{loading && (
				<Box className="flex flex-1 items-center">
					<span className="pr-8">Loading...</span>
					<CircularProgress size={26} />
				</Box>
			)}
			<NotesToolbarPagination
				goToPage={goToPage}
				onRowsLimitChange={onRowsLimitChange}
				count={count}
				pageIndex={params.page - 1}
				limit={params.limit}
			/>
		</div>
	);
}

export default NoteToolbar;
