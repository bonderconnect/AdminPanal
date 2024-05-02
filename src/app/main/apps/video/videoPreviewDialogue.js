import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { closeVideoPreview } from './store/videoPreviewSlice';

const useStyles = makeStyles(theme => ({
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
}));

function VideoPreviewDialogue(props) {
	const dispatch = useDispatch();
	const { dialogue, video, loading } = useSelector(({ videoApp }) => videoApp.videoPreview);

	const classes = useStyles(props);

	const handleDialogueClose = () => {
		dispatch(closeVideoPreview());
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			onClose={handleDialogueClose}
			aria-labelledby="customized-dialog-title"
			open={dialogue.props.open}
			fullWidth
			maxWidth="md"
		>
			{loading && (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading preview ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!loading && video && (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="h6">{video.title} - Preview</Typography>
							<IconButton
								aria-label="close"
								className={classes.closeButton}
								onClick={handleDialogueClose}
							>
								<CloseIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
					<DialogContent className="p-0">
						{video.learning_material_video_meta.streamingService === 'youtube' ? (
							<iframe
								title="iframe"
								src={`https://www.youtube.com/embed/${video.learning_material_video_meta.youtubeVideoId}`}
								width="100%"
								height="560"
								frameBorder="0"
								allow="autoplay; fullscreen"
								allowFullScreen
							/>
						) : (
							<iframe
								title="iframe"
								src={`https://player.vimeo.com/video/${video.learning_material_video_meta.vimeoVideoId}`}
								width="100%"
								height="560"
								frameBorder="0"
								allow="autoplay; fullscreen"
								allowFullScreen
							/>
						)}
					</DialogContent>
				</>
			)}
		</Dialog>
	);
}

export default VideoPreviewDialogue;
