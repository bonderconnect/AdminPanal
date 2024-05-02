import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { getVideosWatch, setParams } from '../store/videosWatchSlice';
import AnalyticsVideosWatchContentSearch from './AnalyticsVideosWatchContentSearch';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

const AnalyticsVideosWatchContent = () => {
	const params = useSelector(state => state.analyticsApp.videosWatch.params);
	const meta = useSelector(state => state.analyticsApp.videosWatch.meta);
	const { loading, data } = useSelector(state => state.analyticsApp.videosWatch.list);
	const dispatch = useDispatch();
	const [rows, setRows] = useState(null);
	const [sortDir, setSortDir] = useState('desc');
	const classes = useStyles();

	const handleSortChange = ev => {
		setSortDir(ev.target.value);
	};

	useEffect(() => {
		const updatedParams = { ...params, sort_dir: sortDir };
		dispatch(setParams(updatedParams));
	}, [sortDir]);

	useEffect(() => {
		dispatch(getVideosWatch());
	}, [params]);

	const handleChangePage = (event, nextPageIndex) => {
		const updatedParams = { ...params, page: nextPageIndex + 1 };
		dispatch(setParams(updatedParams));
	};

	const handleChangeRowsPerPage = event => {
		const changedPageSize = Number(event.target.value);
		const updatedParams = { ...params, limit: changedPageSize };
		dispatch(setParams(updatedParams));
	};

	useEffect(() => {
		const rowsUpdated = [];
		if (data && data.length) {
			data.forEach((item, index) => {
				const rowItem = {
					item,
					id: item.user_id,
					cells: [
						{
							id: 'si_no',
							value: `# ${index + 1}`,
							classes: 'text-center'
						},
						{
							id: 'user_avatar',
							value: item.name
						},
						{
							id: 'users_name',
							value: item.name,
							classes: 'text-center text-lg font-bold',
							icon: ''
						},
						{
							id: 'user_created_on',
							value: moment(item.user_created_on).format('MMMM Do YYYY, h:mm a'),
							classes: 'text-center',
							icon: ''
						},
						{
							id: 'watch_count',
							value: item.total_distinct_video_watch_count,
							classes: 'text-center text-2xl',
							icon: ''
						}
					]
				};
				rowsUpdated.push(rowItem);
			});
		}
		setRows(rowsUpdated);
	}, [data]);

	const columns = [
		{
			id: 'si_no',
			title: 'Sl.no #'
		},
		{
			id: 'avatar',
			title: ''
		},
		{
			id: 'users_name',
			title: 'User'
		},
		{
			id: 'user_onboarded',
			title: 'User Joined'
		},
		{
			id: 'videos_watch_count',
			title: 'Videos watched'
		},
		{
			id: 'action',
			title: ''
		}
	];

	return (
		<div className="flex flex-col">
			<Paper className="w-full rounded-20 shadow overflow-hidden">
				<div className="flex items-center justify-between m-20 h-64">
					<div>
						<AnalyticsVideosWatchContentSearch />
					</div>
					<div className="flex mr-32">
						<FormControl className={classes.formControl}>
							<InputLabel id="demo-simple-select-label">Sort by:</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={sortDir}
								onChange={handleSortChange}
							>
								<MenuItem value="desc">More engaged</MenuItem>
								<MenuItem value="asc">Less engaged</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				<div className="table-responsive">
					<Table className="w-full min-w-full">
						<TableHead>
							<TableRow>
								{columns.map(column => (
									<TableCell key={column.id}>
										<Typography
											color="textSecondary"
											className="font-semibold whitespace-nowrap text-center"
										>
											{column.title}
										</Typography>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows && rows.length
								? rows.map(row => (
										<TableRow key={row.id} className="h-64">
											{row.cells.map(cell => {
												let cellJsx;

												switch (cell.id) {
													case 'user_avatar':
														cellJsx = (
															<TableCell key={cell.id} component="th" scope="row">
																<div className="flex items-center">
																	<Avatar className="mr-8">
																		{cell.value
																			? cell.value.split('')[0].toUpperCase()
																			: 'A'}
																	</Avatar>
																	<div className="flex flex-col">
																		{row.item.phone ? (
																			<span>{row.item.phone}</span>
																		) : null}
																		{row.item.email ? (
																			<span>{row.item.email}</span>
																		) : null}
																	</div>
																</div>
															</TableCell>
														);
														break;

													default:
														cellJsx = (
															<TableCell key={cell.id} component="th" scope="row">
																<Typography className={cell.classes}>
																	{cell.value}
																</Typography>
															</TableCell>
														);
														break;
												}

												return cellJsx;
											})}
											<TableCell component="th" scope="row">
												<div className="flex items-center">
													<Button
														component={RouterLink}
														to={`/apps/users/user/${row.id}/analytics/videos`}
														variant="outlined"
														size="small"
														endIcon={<Icon>arrow_right</Icon>}
													>
														View all
													</Button>
												</div>
											</TableCell>
										</TableRow>
								  ))
								: null}
						</TableBody>
					</Table>
				</div>
			</Paper>
			<div className="flex justify-between flex-1">
				<div>
					{loading ? (
						<div className="flex items-center">
							<span className="text-xl mr-12">Loading ...</span>
							<CircularProgress size={24} />
						</div>
					) : null}
				</div>
				<TablePagination
					component="div"
					classes={{
						root: 'overflow-hidden flex-shrink-0 border-0',
						spacer: 'w-0 max-w-0'
					}}
					colSpan={5}
					count={meta.totalItems}
					rowsPerPage={params.limit}
					page={meta && meta.number ? Number(meta.number) - 1 : 0}
					SelectProps={{
						inputProps: { 'aria-label': 'rows per page' },
						native: false
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
					ActionsComponent={PaginationActions}
				/>
			</div>
		</div>
	);
};

export default AnalyticsVideosWatchContent;
