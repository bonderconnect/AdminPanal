import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import helpers from 'app/utils/helpers';
import ExamQuestionsTable from './ExamQuestionsTable';
import {
	getExamQuestions,
	setParams,
	openEditExamQuestionDialog,
	openExamQuestionOptionsDialog,
	removeExamQuestion
} from '../store/examQuestionsSlice';

const isCRUDisabled = process.env.REACT_APP_DISABLE_EXAM_EDIT;

const useStyles = makeStyles(theme => ({
	button: {
		margin: theme.spacing(1)
	}
}));

function ExamQuestionsList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	const { params, learningMaterial, questions } = useSelector(({ examApp }) => examApp.examQuestions);

	useDeepCompareEffect(() => {
		if (learningMaterial) {
			dispatch(getExamQuestions({ params, learningMaterialId: learningMaterial.learning_material_id }));
		}
	}, [dispatch, params, learningMaterial]);

	const goToPage = nextPageIndex => {
		dispatch(setParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		dispatch(setParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const openQuestionDialog = question => setTimeout(() => dispatch(openEditExamQuestionDialog(question)), 0);
	const openQuestionOptions = question => setTimeout(() => dispatch(openExamQuestionOptionsDialog(question)), 0);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: 'Serving priority',
				accessor: 'serving_priority',
				sortable: false,
				className: 'text-center'
			},
			{
				Header: 'Question',
				accessor: 'question',
				sortable: false,
				Cell: ({ row }) => (
					<div className="max-w-md whitespace-pre-wrap break-words">
						{helpers.trimCkeditorValue(row.original.question)}
					</div>
				)
			},
			{
				Header: 'Score',
				accessor: 'score',
				sortable: false
			},
			{
				Header: 'Explanation',
				accessor: 'phone',
				sortable: false,
				Cell: ({ row }) => (
					<div className="max-w-md whitespace-pre-wrap break-words">
						{helpers.trimCkeditorValue(row.original.explanation)}
					</div>
				)
			},
			{
				id: 'action',
				sortable: false,
				Cell: ({ row }) =>
					!isCRUDisabled ? (
						<div className="flex flex-1">
							<div className="flex items-end">
								<Button
									startIcon={<Icon>edit</Icon>}
									className={clsx(classes.actionButton, 'mr-6')}
									variant="contained"
									onClick={() => openQuestionDialog(row.original)}
									size="small"
								>
									Edit
								</Button>
								<Button
									startIcon={<Icon>add</Icon>}
									className={clsx(classes.actionButton, 'mr-6')}
									variant="contained"
									onClick={() => openQuestionOptions(row.original)}
									// onClick={() => dispatch(openExamQuestionOptionDialog(row.original))}
									size="small"
								>
									Add / edit Options
								</Button>
								<Button
									startIcon={<Icon>delete</Icon>}
									variant="contained"
									size="small"
									className={clsx(classes.actionButton, 'mr-6')}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(
											openDialog({
												children: (
													<>
														<DialogTitle id="alert-dialog-title">
															Are you sure want to delete this question?
														</DialogTitle>
														<DialogContent>
															<DialogContentText id="alert-dialog-description">
																This action irreversible. But you'll able to retreive
																the material's data within 30 days by contacting support
																team.
															</DialogContentText>
														</DialogContent>
														<DialogActions>
															<Button
																onClick={() => dispatch(closeDialog())}
																color="primary"
															>
																Cancel
															</Button>
															<Button
																onClick={() => {
																	dispatch(
																		removeExamQuestion({
																			learningMaterialId:
																				learningMaterial.learning_material_id,
																			learningMaterialExamQuestionId:
																				row.original.id
																		})
																	);
																	dispatch(closeDialog());
																}}
																color="secondary"
																autoFocus
															>
																Continue
															</Button>
														</DialogActions>
													</>
												)
											})
										);
									}}
								>
									Delete
								</Button>
							</div>
						</div>
					) : null
			}
		],
		[dispatch]
	);

	// Will do the fiteration steps here
	useEffect(() => {
		setFilteredData(questions);
	}, [questions]);

	useEffect(() => () => setFilteredData(null), []);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					No Questions to show
				</Typography>
			</div>
		);
	}
	return (
		<ExamQuestionsTable
			columns={columns}
			data={filteredData}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			count={learningMaterial.question_count}
			pageIndex={params.page - 1}
			limit={params.limit}
			onRowClick={(ev, row) => {
				console.log(ev, row);
				// if (row) {
				// 	dispatch(openEditUserDialog(row.original));
				// }
			}}
		/>
	);
}

export default ExamQuestionsList;
