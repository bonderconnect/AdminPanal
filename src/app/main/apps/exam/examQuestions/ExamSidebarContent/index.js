import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import {
	getExam,
	updateExplainerVideo,
	openExplainerVideoPreview,
	deleteExplainerVideo
} from '../../store/examQuestionsSlice';
import ExplainerVideoUploadProgress from './ExplainerVideoUploadProgress';
import ExplainerVideoPreviewDialogue from './ExplainerVideoPreviewDialogue';

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			marginRight: 16
		}
	},
	listItemValue: {
		width: 30,
		textAlign: 'center'
	},
	noExplainaryText: {
		fontStyle: 'italic',
		color: '#6F7479'
	},
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
		paddingBottom: '0px !important',
		cursor: 'pointer'
	},
	videoPlayIcon: {
		background: 'rgba(255,255,255,.9)',
		borderRadius: '100%'
	},
	videoItem: {
		borderBottom: `1px solid  ${theme.palette.divider}`
	},
	inlineDeleteButton: {
		color: '#CD6155',
		'&:hover': {
			textDecoration: 'underline'
		}
	}
}));

function ExamSidebarContent(props) {
	const classes = useStyles(props);
	const fileRef = useRef(null);
	const dispatch = useDispatch();
	const {
		learningMaterial,
		explainerVideo: {
			upload: { inProgress: explainerVideoUploadInProgress }
		}
	} = useSelector(({ examApp }) => examApp.examQuestions);
	const handleExplainerVideoUpload = () => {
		fileRef.current.click();
	};

	const handleDeleteExplainerVideo = () => {
		const callback = () => {
			dispatch(
				getExam({
					learningMaterialId: learningMaterial.learning_material_id
				})
			);
		};

		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle id="alert-dialog-title">
							Are you sure want to delete this explainer video?
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								This action irreversible. But you'll able to retreive the video file within 30 days by
								contacting support team.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => dispatch(closeDialog())} color="primary">
								Cancel
							</Button>
							<Button
								onClick={() => {
									dispatch(
										deleteExplainerVideo({
											callback,
											learningMaterialId: learningMaterial.learning_material_id
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
	};

	const onFileChange = () => {
		console.log('onFileChange');
		const file = fileRef.current.files && fileRef.current.files[0];
		if (file) {
			const callback = () => {
				dispatch(
					getExam({
						learningMaterialId: learningMaterial.learning_material_id
					})
				);
			};

			const payload = {
				file,
				learningMaterialId: learningMaterial.learning_material_id,
				callback
			};
			dispatch(updateExplainerVideo(payload));
		}
	};

	// Explainer video disabled for now
	const explainerVideoEnabled = false;

	return (
		<>
			<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
				<Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
					<List>
						<ListItem className={classes.listItem}>
							<div className={classes.listItemValue}>
								<span>{`${learningMaterial.duration / 60}`}</span>
							</div>
							<ListItemText className="truncate" primary=": Duration ( mins )" disableTypography />
						</ListItem>
						<ListItem className={classes.listItem}>
							<div className={classes.listItemValue}>
								<span>{learningMaterial.question_count || 0}</span>
							</div>
							<ListItemText className="truncate" primary=": Total question" disableTypography />
						</ListItem>
						<ListItem className={classes.listItem}>
							<div className={classes.listItemValue}>
								<span>{learningMaterial.total_score || 0}</span>
							</div>
							<ListItemText className="truncate" primary=": Total score" disableTypography />
						</ListItem>
					</List>
					<Divider />
					{explainerVideoEnabled ? (
						<div className="p-12 py-24">
							{!explainerVideoUploadInProgress && !learningMaterial.explainer_video_status ? (
								<div className="flex flex-col items-center">
									<span className={classes.noExplainaryText}>No explainer video</span>
									<Button
										variant="contained"
										size="small"
										color="primary"
										className="mt-12"
										onClick={handleExplainerVideoUpload}
									>
										Upload
									</Button>
									<input
										ref={fileRef}
										accept="video/mp4,video/x-m4v,video/*"
										type="file"
										onChange={onFileChange}
										className="hidden"
									/>
								</div>
							) : null}
							{explainerVideoUploadInProgress ? <ExplainerVideoUploadProgress /> : null}
							{learningMaterial.explainer_video_status === 'uploading' ? (
								<div className="text-center mt-8">
									<span className={classes.noExplainaryText}>
										Uploaded video is under processing, will get displayed here after it's finished
									</span>
								</div>
							) : null}
							{!explainerVideoUploadInProgress && learningMaterial.explainer_video_status === 'ready' ? (
								<div className="flex flex-col items-center">
									<Card
										onClick={ev => {
											ev.stopPropagation();
											if (learningMaterial.explainer_video_status === 'ready') {
												dispatch(openExplainerVideoPreview());
											}
										}}
										className={clsx(classes.thumbnailRoot, 'my-4', 'flex')}
									>
										<CardContent
											style={{
												backgroundImage: `url('${learningMaterial.explainer_video_thumbnail_url}')`
											}}
											className={classes.thumbnailImage}
										>
											{learningMaterial.explainer_video_status === 'ready' ? (
												<Icon
													className={classes.videoPlayIcon}
													color="primary"
													fontSize="large"
												>
													play_circle_outline
												</Icon>
											) : (
												<Typography className="text-center" variant="caption" display="block">
													No preview available
												</Typography>
											)}
										</CardContent>
									</Card>
									<div className="text-center mt-8">
										<span className={classes.noExplainaryText}>
											Replace explainer video with new one :{' '}
										</span>
										{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
										<Link component="button" variant="body2" onClick={handleExplainerVideoUpload}>
											Upload
										</Link>
										<input
											ref={fileRef}
											accept="video/mp4,video/x-m4v,video/*"
											type="file"
											onChange={onFileChange}
											className="hidden"
										/>
									</div>
									<div className="text-center mt-8">
										<span className={classes.noExplainaryText}>
											or <br />
											<button
												type="button"
												onClick={handleDeleteExplainerVideo}
												className={classes.inlineDeleteButton}
											>
												Delete
											</button>{' '}
											current explainer video
										</span>
									</div>
								</div>
							) : null}
						</div>
					) : null}
				</Paper>
			</div>
			<ExplainerVideoPreviewDialogue />
		</>
	);
}

export default ExamSidebarContent;
