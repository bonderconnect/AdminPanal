import _ from '@lodash';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Link as RouterLink } from 'react-router-dom';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import ExamChip from './ExamChip';
import { removeExam, publishExam, unpublishExam } from '../store/examQuestionsSlice';
import { duplicateExam } from '../store/examsSlice';

const isCRUDisabled = process.env.REACT_APP_DISABLE_EXAM_EDIT;

const useStyles = makeStyles(theme => ({
	thumbnailRoot: {
		width: '132px',
		height: '132px'
	},
	thumbnailImage: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		padding: '0px',
		alignItems: 'center',
		margin: '8px',
		backgroundSize: 'cover',
		backgroundPosition: 'center center',
		paddingBottom: '0px !important'
	},
	examItem: {
		borderBottom: `1px solid  ${theme.palette.divider}`
	},
	publishedText: {
		fontSize: 14
	},
	priorityIcon: {
		color: 'rgba(0, 0, 0, 0.54)',
		fontSize: 16
	},
	duplicatedIndicatorIcon: {
		color: 'rgba(0, 0, 0, 0.54)',
		fontSize: 16
	},
	actionButton: {
		padding: '4px 8px',
		fontSize: '12px',
		'& .MuiButton-startIcon': {
			marginRight: '0px'
		}
	},
	metaData: {
		color: '#5f5f5f'
	}
}));

const ExamListItem = props => {
	const dispatch = useDispatch();
	const {
		learningMaterial,
		quickEditExam,
		itemsStatusInChangeProgress,
		itemDuplicationInProgress,
		handleExamItemSelect
	} = props;

	const classes = useStyles(props);

	return (
		<ListItem dense className={clsx(classes.examItem, 'py-6 px-8')}>
			<div className="flex flex-1 flex-col relative overflow-hidden">
				<div className="flex flex-1 px-8 pb-8">
					<div className="flex flex-1 flex-col">
						<div className="flex items-center">
							<Typography variant="h6">{learningMaterial.title}</Typography>
						</div>
						<div className="flex items-center">
							<Typography variant="subtitle2">{learningMaterial.description}</Typography>
						</div>
						<div className="flex flex mt-24 justify-between">
							<div className="flex">
								<div className="flex flex-col mt-4 mr-24">
									<Typography className={classes.metaData} variant="caption" display="block">
										Created at:
									</Typography>
									<Typography color="body2" className={clsx('truncate', classes.metaData)}>
										{moment(learningMaterial.created_on).format('MMMM Do YYYY, h:mm a')}
									</Typography>
								</div>
								{learningMaterial.status_value === 1 && learningMaterial.published_at && (
									<div className="flex flex-col mt-4 mr-24">
										<Typography className={classes.metaData} variant="caption" display="block">
											Published at:
										</Typography>
										<Typography color="body2" className={clsx('truncate', classes.metaData)}>
											{moment(learningMaterial.published_at).format('MMMM Do YYYY, h:mm a')}
										</Typography>
									</div>
								)}
							</div>
						</div>
						<div className="flex mt-8">
							<Button
								startIcon={<Icon>question_answer</Icon>}
								className={clsx(classes.actionButton, 'mr-6')}
								disableElevation
								variant="contained"
								size="small"
								onClick={e => {
									e.stopPropagation();
									handleExamItemSelect(learningMaterial.learning_material_id);
								}}
							>
								&nbsp; Questions
							</Button>
							<Button
								startIcon={<Icon>assessment</Icon>}
								className={clsx(classes.actionButton)}
								component={RouterLink}
								to={`/apps/material/exam/${learningMaterial.learning_material_id}/attempts`}
								disableElevation
								variant="contained"
								size="small"
							>
								Attempts
							</Button>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<div className="flex flex-1 flex-col items-end">
							<div className="flex">
								<div className="flex mr-12">
									{learningMaterial.status_value === 1 && (
										<ExamChip className="mx-2 mt-4" title="Published" color="#07A62B" />
									)}
									{learningMaterial.status_value === 0 ? (
										<ExamChip className="mx-2 mt-4" title="Unpublished" color="#FF5733" />
									) : null}
								</div>
								<div className="flex items-center">
									<Tooltip
										title={`Serving priority ${learningMaterial.serving_priority}`}
										placement="left"
									>
										<Typography variant="subtitle1">{learningMaterial.serving_priority}</Typography>
									</Tooltip>
									<Icon className={classes.priorityIcon}>low_priority</Icon>
								</div>
							</div>
							{learningMaterial.duplicated_from_learning_material_id ? (
								<div className="flex mt-4">
									<Tooltip title="Duplicated material" placement="left">
										<Icon className={classes.duplicatedIndicatorIcon}>file_copy</Icon>
									</Tooltip>
								</div>
							) : null}
						</div>
						<div className="flex mt-6">
							<Button
								startIcon={<Icon>file_copy</Icon>}
								variant="contained"
								size="small"
								color="primary"
								disabled={
									itemDuplicationInProgress.indexOf(learningMaterial.learning_material_id) !== -1
								}
								className={clsx(classes.actionButton, 'mr-6', 'px-24')}
								onClick={ev => {
									ev.stopPropagation();
									dispatch(
										openDialog({
											children: (
												<>
													<DialogTitle id="alert-dialog-title">
														Are you sure want to duplicate this material?
													</DialogTitle>
													<DialogContent>
														<DialogContentText id="alert-dialog-description">
															By continue, you will create a duplicate of this material.
															<br />( NB: The newly created material will have the same
															serving priority as this material )
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button onClick={() => dispatch(closeDialog())} color="primary">
															Cancel
														</Button>
														<Button
															onClick={() => {
																dispatch(
																	duplicateExam(learningMaterial.learning_material_id)
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
								&nbsp; Duplicate
							</Button>
							{!isCRUDisabled ? (
								<>
									<Button
										startIcon={<Icon>edit</Icon>}
										variant="contained"
										size="small"
										color="primary"
										className={clsx(classes.actionButton, 'mr-6', 'px-24')}
										onClick={ev => {
											ev.stopPropagation();
											quickEditExam(learningMaterial.learning_material_id);
										}}
									>
										&nbsp; Edit
									</Button>
									<Button
										startIcon={<Icon>delete</Icon>}
										variant="contained"
										size="small"
										color="primary"
										className={clsx(classes.actionButton, 'mr-6')}
										onClick={ev => {
											ev.stopPropagation();
											dispatch(
												openDialog({
													children: (
														<>
															<DialogTitle id="alert-dialog-title">
																Are you sure want to delete this material?
															</DialogTitle>
															<DialogContent>
																<DialogContentText id="alert-dialog-description">
																	This action irreversible. But you'll able to
																	retreive the material's data within 30 days by
																	contacting support team.
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
																			removeExam(
																				learningMaterial.learning_material_id
																			)
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
									/>
								</>
							) : null}
							{learningMaterial.status_value === 0 && (
								<Button
									startIcon={<Icon>check</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={
										// Need to make this value dynamic
										false
									}
									className={classes.actionButton}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(publishExam(learningMaterial.learning_material_id));
									}}
								>
									Publish
								</Button>
							)}
							{learningMaterial.status_value === 1 && (
								<Button
									startIcon={<Icon>clear</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={
										itemsStatusInChangeProgress.indexOf(learningMaterial.learning_material_id) !==
										-1
									}
									className={classes.actionButton}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(unpublishExam(learningMaterial.learning_material_id));
									}}
								>
									Unpublish
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</ListItem>
	);
};

export default ExamListItem;
