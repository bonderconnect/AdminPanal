import _ from '@lodash';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconMdi from '@mdi/react';
import { mdiFilePdfOutline } from '@mdi/js';
import Icon from '@material-ui/core/Icon';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import NoteChip from '../NoteChip';
import { duplicateNote } from '../store/notesSlice';
import { removeNote, publishNote, unpublishNote, getNoteLink } from '../store/noteSlice';

const useStyles = makeStyles(theme => ({
	noteItem: {
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

const NoteListItem = props => {
	const dispatch = useDispatch();
	const { note, handleNoteItemSelect, itemsStatusInChangeProgress, itemDuplicationInProgress, openNoteLink } = props;

	const classes = useStyles(props);

	useEffect(() => {
		if (note.link) {
			openNoteLink(note.link);
		}
	}, [note.link]);

	return (
		<ListItem dense className={clsx(classes.noteItem, 'py-6 px-8')}>
			<div className="flex flex-1 flex-col relative overflow-hidden">
				<div className="flex flex-1 px-8 pb-8">
					<div className="flex flex-1 flex-col">
						<div className="flex items-center">
							<Typography variant="h6">{note.title}</Typography>
						</div>
						<div className="flex items-center">
							<Typography variant="subtitle2">{note.description}</Typography>
						</div>
						<div className="flex flex mt-24 justify-between">
							<div className="flex">
								<div className="flex flex-col mt-4 mr-24">
									<Typography className={classes.metaData} variant="caption" display="block">
										Created at:
									</Typography>
									<Typography color="body2" className={clsx('truncate', classes.metaData)}>
										{moment(note.created_on).format('MMMM Do YYYY, h:mm a')}
									</Typography>
								</div>
								{note.status_value === 1 && note.published_at && (
									<div className="flex flex-col mt-4">
										<Typography className={classes.metaData} variant="caption" display="block">
											Published at:
										</Typography>
										<Typography color="body2" className={clsx('truncate', classes.metaData)}>
											{moment(note.published_at).format('MMMM Do YYYY, h:mm a')}
										</Typography>
									</div>
								)}
							</div>
						</div>
						<div className="flex mt-16">
							<Button
								startIcon={<IconMdi path={mdiFilePdfOutline} size={1.2} />}
								variant="outlined"
								size="small"
								color="primary"
								onClick={ev => {
									ev.stopPropagation();
									return note.link
										? openNoteLink(note.link)
										: dispatch(getNoteLink(note.learning_material_id));
								}}
							>
								{note.loading_link ? 'Loading' : 'Preview'}
							</Button>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<div className="flex flex-1 flex-col items-end">
							<div className="flex">
								<div className="flex mr-12">
									{note.status_value === 1 && (
										<NoteChip className="mx-2 mt-4" title="Published" color="#07A62B" />
									)}
									{note.status_value === 0 && (
										<NoteChip className="mx-2 mt-4" title="Unpublished" color="#FF5733" />
									)}
								</div>
								<div className="flex items-center">
									<Tooltip title={`Serving priority ${note.serving_priority}`} placement="left">
										<Typography variant="subtitle1">{note.serving_priority}</Typography>
									</Tooltip>
									<Icon className={classes.priorityIcon}>low_priority</Icon>
								</div>
							</div>
							{note.duplicated_from_learning_material_id ? (
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
								disabled={itemDuplicationInProgress.indexOf(note.learning_material_id) !== -1}
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
																dispatch(duplicateNote(note.learning_material_id));
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
							<Button
								startIcon={<Icon>edit</Icon>}
								variant="contained"
								size="small"
								color="primary"
								className={clsx(classes.actionButton, 'mr-6', 'px-24')}
								onClick={ev => {
									ev.stopPropagation();
									handleNoteItemSelect(note.id);
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
															This action irreversible. But you'll able to retreive the
															material's data within 30 days by contacting support team.
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button onClick={() => dispatch(closeDialog())} color="primary">
															Cancel
														</Button>
														<Button
															onClick={() => {
																dispatch(removeNote(note.learning_material_id));
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

							{note.status_value === 0 && (
								<Button
									startIcon={<Icon>check</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={itemsStatusInChangeProgress.indexOf(note.learning_material_id) !== -1}
									className={classes.actionButton}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(publishNote(note.learning_material_id));
									}}
								>
									Publish
								</Button>
							)}
							{note.status_value === 1 && (
								<Button
									startIcon={<Icon>clear</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={itemsStatusInChangeProgress.indexOf(note.learning_material_id) !== -1}
									className={classes.actionButton}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(unpublishNote(note.learning_material_id));
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

export default withRouter(NoteListItem);
