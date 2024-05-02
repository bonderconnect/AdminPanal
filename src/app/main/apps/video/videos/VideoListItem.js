import _ from '@lodash';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useDispatch } from 'react-redux';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import VideoChip from '../VideoChip';
import { removeVideo, publishVideo, unpublishVideo, duplicateVideo } from '../store/videosSlice';
import { openVideoPreview } from '../store/videoPreviewSlice';

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
	videoPlayIcon: {
		background: 'rgba(255,255,255,.9)',
		borderRadius: '100%'
	},
	videoItem: {
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
	},
	updatePublishButton: {
		minWidth: 114
	}
}));

const VideoListItem = props => {
	const dispatch = useDispatch();
	const { video, handleVideoItemSelect, itemsStatusInChangeProgress, itemDuplicationInProgress } = props;

	const classes = useStyles(props);

	const errored =
		(video.video_status_value === null || video.video_status_value === 2 || video.video_status_value === 4) &&
		video.status_value === 0;

	const processing = (video.video_status_value === 1 || video.video_status_value === 3) && video.status_value === 0;

	return (
		<ListItem dense className={clsx(classes.videoItem, 'py-6 px-8')}>
			<div className="flex flex-1 flex-col relative overflow-hidden">
				<div className="flex flex-1 px-8 pb-8">
					<div className="flex">
						<Card
							onClick={ev => {
								ev.stopPropagation();
								if (video.video_status_value === 5) {
									dispatch(openVideoPreview(video.learning_material_id));
								}
							}}
							className={clsx(classes.thumbnailRoot, 'mx-28', 'my-4', 'flex', 'cursor-pointer')}
						>
							<CardContent
								style={{ backgroundImage: `url('${video.video_thumbnail_url}')` }}
								className={classes.thumbnailImage}
							>
								{video.video_status_value === 5 ? (
									<Icon className={classes.videoPlayIcon} color="primary" fontSize="large">
										play_circle_outline
									</Icon>
								) : (
									<Typography className="text-center" variant="caption" display="block">
										No preview available
									</Typography>
								)}
							</CardContent>
						</Card>
					</div>
					<div className="flex flex-1 flex-col">
						<div className="flex items-center">
							<Typography variant="h6">{video.title}</Typography>
						</div>
						<div className="flex items-center">
							<Typography variant="subtitle2">{video.description}</Typography>
						</div>
						<div className="flex flex mt-24 justify-between">
							<div className="flex">
								<div className="flex flex-col mt-4 mr-24">
									<Typography className={classes.metaData} variant="caption" display="block">
										Created at:
									</Typography>
									<Typography color="body2" className={clsx('truncate', classes.metaData)}>
										{moment(video.created_on).format('MMMM Do YYYY, h:mm a')}
									</Typography>
								</div>
								{video.status_value === 1 && video.published_at && (
									<div className="flex flex-col mt-4">
										<Typography className={classes.metaData} variant="caption" display="block">
											Published at:
										</Typography>
										<Typography color="body2" className={clsx('truncate', classes.metaData)}>
											{moment(video.published_at).format('MMMM Do YYYY, h:mm a')}
										</Typography>
									</div>
								)}
							</div>
						</div>
						<div className="flex mt-8">
							<Button
								startIcon={<Icon>subscriptions</Icon>}
								className={clsx(classes.actionButton)}
								component={RouterLink}
								to={`/apps/material/video/${video.learning_material_id}/watch-logs`}
								disableElevation
								variant="contained"
								size="small"
							>
								Watch logs
							</Button>
						</div>
					</div>
					<div className="flex flex-col items-end">
						<div className="flex flex-1 flex-col items-end">
							<div className="flex">
								<div className="flex mr-12">
									{video.status_value === 1 && (
										<VideoChip className="mx-2 mt-4" title="Published" color="#07A62B" />
									)}
									{processing && (
										<VideoChip className="mx-2 mt-4" title="Processing" color="#cccccc" />
									)}
									{errored && <VideoChip className="mx-2 mt-4" title="Error" color="#000000" />}
									{video.video_status_value === 5 && video.status_value === 0 && (
										<VideoChip className="mx-2 mt-4" title="Unpublished" color="#FF5733" />
									)}
								</div>
								<div className="flex items-center">
									<Tooltip title={`Serving priority ${video.serving_priority}`} placement="left">
										<Typography variant="subtitle1">{video.serving_priority}</Typography>
									</Tooltip>
									<Icon className={classes.priorityIcon}>low_priority</Icon>
								</div>
							</div>
							{video.duplicated_from_learning_material_id ? (
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
									processing ||
									errored ||
									itemDuplicationInProgress.indexOf(video.learning_material_id) !== -1
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
																dispatch(duplicateVideo(video.learning_material_id));
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
									handleVideoItemSelect(video.id);
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
																dispatch(removeVideo(video.learning_material_id));
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
							{video.status_value === 0 && (
								<Button
									startIcon={<Icon>check</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={
										processing ||
										errored ||
										itemsStatusInChangeProgress.indexOf(video.learning_material_id) !== -1
									}
									className={clsx(classes.actionButton, classes.updatePublishButton)}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(publishVideo(video.learning_material_id));
									}}
								>
									Publish
								</Button>
							)}
							{video.status_value === 1 && (
								<Button
									startIcon={<Icon>clear</Icon>}
									variant="contained"
									size="small"
									color="primary"
									disabled={itemsStatusInChangeProgress.indexOf(video.learning_material_id) !== -1}
									className={clsx(classes.actionButton, classes.updatePublishButton)}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(unpublishVideo(video.learning_material_id));
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

export default withRouter(VideoListItem);
