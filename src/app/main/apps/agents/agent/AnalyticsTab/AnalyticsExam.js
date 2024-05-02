import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
// eslint-disable-next-line import/extensions
import { getUserExamsAttended, setParams } from '../../store/agent/analytics/examsSlice.js';

const useStyles = makeStyles({
	container: {
		backgroundColor: '#fff'
	},
	table: {
		minWidth: 650
	}
});

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

function AnayticsExam() {
	const classes = useStyles();
	const urlParams = useParams();
	const { userId } = urlParams;
	const dispatch = useDispatch();
	const {
		list: { loading, data },
		params,
		meta
	} = useSelector(state => state.usersApp.user.analytics.exams);

	useEffect(() => {
		dispatch(getUserExamsAttended(userId));
	}, [params, userId]);

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
						Attended Referrals
					</Typography>
					{!(data && data.length) && (
						<div className="flex px-6">
							<Typography variant="subtitle1"> No items to show!</Typography>
						</div>
					)}
					{data && data.length ? (
						<TableContainer component={Paper}>
							<Table className={classes.table} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Exam title</TableCell>
										<TableCell align="center">Started on</TableCell>
										<TableCell align="center">Submitted on</TableCell>
										<TableCell align="center">Score</TableCell>
										<TableCell align="center">Answered</TableCell>
										<TableCell align="center">Correct</TableCell>
										<TableCell align="center">Negative</TableCell>
										<TableCell align="center">Percentage</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map(item => {
										const percentageObtained = Number(
											(item.optained_score / item.total_score) * 100
										).toFixed(2);

										return (
											<TableRow key={item.learning_material_user_attempt_id}>
												<TableCell component="th" scope="row">
													{item.title}
												</TableCell>
												<TableCell align="center">
													{moment(item.started_on).format('MMM Do / YY, h:mm a')}
												</TableCell>
												<TableCell align="center">
													{moment(item.submitted_on).format('MMM Do / YY, h:mm a')}
												</TableCell>
												<TableCell align="center">
													{`${
														Number(item.optained_score) > 0
															? Number(item.optained_score)
															: 0
													} / ${item.total_score}`}
												</TableCell>
												<TableCell align="center">{item.answered_questions}</TableCell>
												<TableCell align="center">{item.rightly_answered}</TableCell>
												<TableCell align="center">{item.negative_score}</TableCell>
												<TableCell align="center">{`${
													percentageObtained > 0 ? percentageObtained : 0
												} %`}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					) : null}
					{data && data.length ? (
						<div className="flex justify-between flex-1">
							<div>
								{loading ? (
									<div className="flex items-center mx-16 my-8 ">
										<span className="text-lg mr-12">Loading ...</span>
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
					) : null}
				</>
			) : null}
		</div>
	);
}

export default AnayticsExam;
