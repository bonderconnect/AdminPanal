import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PaginationActions from 'app/fuse-layouts/shared-components/PaginationActions';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import FullscreenLoader from 'app/fuse-layouts/shared-components/FullscreenLoader';
import { CircularProgress, TablePagination } from '@material-ui/core';
import moment from 'moment';
import { getVideoWatchLogsOfAllUsers, setParams } from '../../../store/recordings/video/watchLogs';
import Search from './Search';

const useStyles = makeStyles(theme => ({
	tabs: {
		'& .MuiTab-root ': {
			color: theme.palette.primary.main
		}
	}
}));

const WatchLogsTab = () => {
	const urlParams = useParams();
	const classes = useStyles();
	const { learningMaterialId } = urlParams;
	const dispatch = useDispatch();
	const {
		list: { loading, data },
		params,
		meta
	} = useSelector(state => state.liveEventApp.recordings.video.watchLogs);

	useDeepCompareEffect(() => {
		dispatch(getVideoWatchLogsOfAllUsers(learningMaterialId));
	}, [params, learningMaterialId]);

	const handleChangePage = (event, nextPageIndex) => {
		const updatedParams = { ...params, page: nextPageIndex + 1 };
		dispatch(setParams(updatedParams));
	};

	const handleChangeRowsPerPage = event => {
		const changedPageSize = Number(event.target.value);
		const updatedParams = { ...params, limit: changedPageSize, page: 1 };
		dispatch(setParams(updatedParams));
	};

	const showFullScreenLoader = !loading && !data;

	return (
		<div className={clsx('flex flex-1 flex-col p-12', classes.container)}>
			{showFullScreenLoader ? <FullscreenLoader /> : null}
			{!showFullScreenLoader ? (
				<>
					<Typography className="mb-12 ml-4 mt-12" variant="h6" gutterBottom>
						Video watch logs
					</Typography>
					<div className="flex flex-col ">
						<Paper className="flex mb-6 p-16 justify-between" elevation={0}>
							<Search />
						</Paper>
						{data && data.length ? (
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>User</TableCell>
											<TableCell align="center">Watched on</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.map(item => {
											return (
												<TableRow key={item.learning_material_video_watch_log_id}>
													<TableCell component="th" scope="row">
														{item.name}
													</TableCell>
													<TableCell align="center">
														{moment(item.created_on).format('MMM Do / YY, h:mm a')}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>
						) : null}
						{data !== null && !(data && data.length) && (
							<Paper className="flex p-16">
								<Typography variant="subtitle1"> No items to show!</Typography>
							</Paper>
						)}
					</div>
					<div className="flex justify-between flex-1">
						<div>
							{loading ? (
								<div className="flex items-center mx-16 my-8 ">
									<span className="text-lg mr-12">Loading ...</span>
									<CircularProgress size={24} />
								</div>
							) : null}
						</div>
						{data && data.length ? (
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
						) : null}
					</div>
				</>
			) : null}
		</div>
	);
};

export default WatchLogsTab;
