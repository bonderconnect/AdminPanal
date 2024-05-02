import _ from '@lodash';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import React, { forwardRef } from 'react';

const useStyles = makeStyles({
	root: {
		fontSize: 13,
		backgroundColor: 'rgba(0, 0, 0, 0.08)',
		border: '1px solid rgba(0, 0, 0, 0.16)',
		paddingLeft: 16,
		marginBottom: 8,
		borderRadius: 2,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	filename: {
		fontWeight: 600
	},
	size: {
		marginLeft: 8,
		fontWeight: 300
	},
	error: {
		color: '#f44336',
		marginLeft: '14px',
		marginRight: '14px',
		margin: 0,
		fontSize: '1.2rem',
		marginTop: '3px',
		textAlign: 'left'
	}
});

const VideoFile = forwardRef((props, ref) => {
	const classes = useStyles();
	const { file, setFile, videoDialogueUploadInProgress, error } = props;
	const uploadPercentage = useSelector(({ liveEventApp }) => liveEventApp.recordings.videoDialogue.upload.percentage);

	const onFileRemove = () => {
		setFile(null);
		ref.current.value = '';
	};
	const onFileChange = () => {
		setFile(ref.current.files[0]);
	};

	const openFile = () => ref.current.click();

	return (
		<>
			{!file ? (
				<>
					<div className={clsx('flex', 'flex-col', 'flex-1')}>
						<div
							className={clsx(
								classes.root,
								props.className,
								'mt-12',
								'mb-2',
								'py-12',
								'flex-1',
								'cursor-pointer'
							)}
							onKeyPress={openFile}
							onClick={openFile}
							role="button"
							tabIndex="0"
						>
							<div className="flex px-12">
								<Typography variant="caption" className={classes.filename}>
									No File choosen
								</Typography>
								<Typography variant="caption" className={classes.size}>
									Click here to choose a file
								</Typography>
							</div>
							<IconButton className="ml-12 pointer-events-none invisible" onClick={onFileRemove}>
								<Icon className="text-16">close</Icon>
							</IconButton>
						</div>
					</div>
				</>
			) : (
				<>
					<div className={clsx('flex', 'flex-col', 'flex-1')}>
						<div className={clsx(classes.root, props.className, 'mt-12', 'py-12', 'mb-2', 'flex-1')}>
							<Typography variant="caption" className={classes.filename}>
								{_.truncate(file.name.replace(/<(?:.|\n)*?>/gm, ''), { length: 22 })}
							</Typography>
							{videoDialogueUploadInProgress ? (
								<Typography variant="caption" className={classes.size}>
									{uploadPercentage} %
								</Typography>
							) : (
								<Typography variant="caption" className={classes.size}>
									({Number(file.size / 1000 / 1000).toFixed(2)} mb)
								</Typography>
							)}
							<IconButton
								className={clsx(
									'ml-12',
									videoDialogueUploadInProgress && 'pointer-events-none',
									videoDialogueUploadInProgress && 'invisible'
								)}
								onClick={onFileRemove}
							>
								<Icon className="text-16">close</Icon>
							</IconButton>
						</div>
						{error && <p className={classes.error}>{error}</p>}
					</div>
				</>
			)}
			<input
				ref={ref}
				type="file"
				accept="video/mp4,video/x-m4v,video/*"
				onChange={onFileChange}
				className="hidden"
			/>
		</>
	);
});

export default VideoFile;
