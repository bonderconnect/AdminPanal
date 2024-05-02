import _ from '@lodash';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgressWithLabel from 'app/fuse-layouts/shared-components/LinearProgressWithLabel';
import clsx from 'clsx';
import { withFormsy } from 'formsy-react';
import helpers from 'app/utils/helpers';
import React, { memo, useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
	container: {
		minHeight: '62px',
		borderRadius: '4px',
		borderWidth: '1px',
		borderColor: 'rgb(0 0 0 / 30%)',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex'
	},
	fileImagePreviewContainer: {
		width: '100%'
	},
	fileImagePreview: {
		width: '100%',
		height: '180px',
		margin: '10px 0px',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover'
	}
}));

const FileChooserFormsy = props => {
	const classes = useStyles(props);
	const [file, setFile] = useState(null);
	const [fileImagePreview, setFileImagePreview] = useState(null);

	// default prop type's value will be undefined which is considered as video
	const { errorMessage, fileRef, uploadInProgress, uploadPercentage, type } = props;
	const value = props.value || '';

	function changeValue(event) {
		const changedFile = event.target.files[0];
		setFile(changedFile);
		const changedValue = changedFile && changedFile.name;
		props.setValue(changedValue);
		if (props.onChange) {
			const changeEvent = new helpers.CustomEvent('filechooser', changedValue, props.name);
			props.onChange(changeEvent);
		}
		if (type === 'image') {
			const fileReader = new FileReader();
			fileReader.onload = ev => {
				setFileImagePreview(ev.target.result);
			};
			fileReader.readAsDataURL(changedFile);
		}
	}

	const openFile = () => fileRef.current.click();
	const removeFile = () => {
		fileRef.current.value = '';
		setFile(null);
		props.resetValue();
		/**
		 * On remove file the change event will not trigger
		 */
		const changeEvent = new helpers.CustomEvent('filechooser', undefined, props.name);
		props.onChange(changeEvent);
	};

	useEffect(() => {
		if (!file && fileImagePreview) {
			setFileImagePreview(null);
		}
	}, [file, fileImagePreview]);

	return (
		<FormControl
			error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
			className={clsx(props.className, 'flex-1', 'pb-32')}
		>
			<InputLabel
				style={{ zIndex: 0, position: 'static', transform: 'initial' }}
				className="ml-16 mb-10 mt-24"
				htmlFor="formatted-text-mask-input"
			>
				{props.label}
			</InputLabel>
			<div
				onKeyPress={!file && openFile}
				onClick={!file && openFile}
				role="button"
				tabIndex="0"
				className={clsx(classes.container, file && 'pointer-default')}
			>
				{file ? (
					<div className="flex flex-1 justify-center flex-col items-center mx-12">
						{type === 'image' && fileImagePreview ? (
							<div className={classes.fileImagePreviewContainer}>
								<div
									style={{ 'background-image': `url("${fileImagePreview}")` }}
									className={classes.fileImagePreview}
								/>
							</div>
						) : null}
						{uploadInProgress ? (
							<LinearProgressWithLabel progress={uploadPercentage} />
						) : (
							<div className="flex flex-1 justify-center flex-row items-center">
								<span>
									{_.truncate(file.name.replace(/<(?:.|\n)*?>/gm, ''), { length: 22 })} - (
									{Number(file.size / 1000 / 1000).toFixed(2)} mb)
								</span>
								<IconButton onClick={removeFile} aria-label="delete" color="primary">
									<CloseIcon />
								</IconButton>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-1 justify-center">
						<span>No file choosen, click here to choose</span>
					</div>
				)}
			</div>
			{Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
			<input ref={fileRef} type="file" accept={props.acceptFileTypes} onChange={changeValue} className="hidden" />
		</FormControl>
	);
};

export default memo(withFormsy(FileChooserFormsy));
