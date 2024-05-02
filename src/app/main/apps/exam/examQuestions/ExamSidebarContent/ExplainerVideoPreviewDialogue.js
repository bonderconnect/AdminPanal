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
import { closeExplainerVideoPreviewDialog } from '../../store/examQuestionsSlice';

const useStyles = makeStyles(theme => ({
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
}));

function ExplainerVideoUplodProgress(props) {
	const dispatch = useDispatch();
	const { learningMaterial } = useSelector(({ examApp }) => examApp.examQuestions);
	const { dialogue, loading } = useSelector(({ examApp }) => examApp.examQuestions.explainerVideo.preview);

	const classes = useStyles(props);

	const handleDialogueClose = () => {
		dispatch(closeExplainerVideoPreviewDialog());
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
			{learningMaterial && learningMaterial.explainer_video_status === 'ready' && (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="h6">{learningMaterial.title} Explainer video - Preview</Typography>
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
						<iframe
							title="iframe"
							src={`https://player.vimeo.com/video/${learningMaterial.explainer_video_meta.vimeoVideoId}`}
							width="100%"
							height="560"
							frameBorder="0"
							allow="autoplay; fullscreen"
							allowFullScreen
						/>
					</DialogContent>
				</>
			)}
		</Dialog>
	);
}

export default ExplainerVideoUplodProgress;
