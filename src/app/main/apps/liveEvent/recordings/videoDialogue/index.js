import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChipSelectFormsy from '@fuse/core/formsy/ChipSelectFormsy';
import { TextFieldFormsy, CheckboxFormsy } from '@fuse/core/formsy';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileChooser from './FileChooser';
import {
	addVideo,
	updateVideo,
	closeNewVideoDialog,
	closeEditVideoDialog,
	cancelFileUpload
} from '../../store/recordings/videoDialogueSlice';
import CategorySelect from './CategorySelect';
import { selectPackages } from '../../store/recordings/packageSlice';
import UserRestriction from './userRestriction';

const useStyles = makeStyles(theme => ({
	helperText: {
		fontSize: 12,
		fontStyle: 'italic'
	}
}));

const defaultFormState = {
	title: '',
	description: '',
	// status_value: '',
	category_id: '',
	serving_priority: 0,
	file: '',
	user_restriction: false,
	package_ids: [],
	is_free: false
};
/** NB: this component contains shit code, so please make sure that you will not break anything while changeing
 * and make sure that you're well aware of what you're adding & removing in this component. - Early dev :)
 */
function VideoDialog(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const {
		type: videoDialogueType,
		form: videoDialogueForm,
		props: videoDialogueProps,
		errors: videoDialogueErrors,
		submitting: videoDialogueSubmitting,
		loading: videoDialogueLoading,
		upload: { inProgress: uploadInProgress },
		uploadThumbnail: { inProgress: uploadThumbnailInProgress }
	} = useSelector(({ liveEventApp }) => liveEventApp.recordings.videoDialogue);
	const [isFormValid, setIsFormValid] = useState(false);
	const [youtubeDisabled, setYoutubeDisabled] = useState(false);
	const packages = useSelector(selectPackages);
	const categorySelectionRef = useRef(null);
	const categoryElementRef = useRef(null);
	const formPersistRef = useRef(null);
	const videoFileRef = useRef(null);
	const videoThumbnailFileRef = useRef(null);
	const [externalValidationErrors, setExternalValidationErrors] = useState({});

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const statusSelectionoptions = [
		{ value: 1, label: 'Published / Active' },
		{ value: 0, label: 'Unpublished / Inactive' }
	];

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (videoDialogueType === 'edit' && videoDialogueForm) {
			setForm({ ...videoDialogueForm });
			categorySelectionRef.current = videoDialogueForm.category_id;
			formPersistRef.current = { ...videoDialogueForm };
		}

		/**
		 * Dialog type: 'new'
		 */
		if (videoDialogueType === 'new') {
			setForm({
				...defaultFormState,
				...videoDialogueForm
			});
		}
	}, [videoDialogueForm, videoDialogueType, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (videoDialogueProps.open && videoDialogueType === 'new') {
			initDialog();
		} else if (videoDialogueProps.open && videoDialogueType === 'edit' && videoDialogueForm) {
			initDialog();
		}
	}, [videoDialogueProps.open, videoDialogueForm, initDialog]);

	// useEffect(() => {
	// 	console.log('isFormValid:', isFormValid);
	// 	setSubmitButtonEnabled(videoDialogueType === 'new' ? file && isFormValid : isFormValid);
	// }, [isFormValid, file]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	useEffect(() => {
		/**
		 * Listening to server side validations
		 */

		const validationErrors = {};
		Object.keys(videoDialogueErrors).forEach(errorField => {
			validationErrors[errorField] = videoDialogueErrors[errorField].error;
		});
		setExternalValidationErrors(validationErrors);
	}, [videoDialogueErrors]);

	function closeComposeDialog() {
		if (!videoDialogueSubmitting) {
			return videoDialogueType === 'edit' ? dispatch(closeEditVideoDialog()) : dispatch(closeNewVideoDialog());
		}
		return null;
	}

	const handleChangeMiddleware = ev => {
		handleChange(ev);
		const { target } = ev;

		setExternalValidationErrors(state => {
			const updatedErrors = { ...state };
			if (
				videoDialogueErrors[target.name] &&
				videoDialogueErrors[target.name].error &&
				videoDialogueErrors[target.name].withValue === target.value
			) {
				updatedErrors[target.name] = videoDialogueErrors[target.name].error;
			} else {
				delete updatedErrors[target.name];
			}
			return updatedErrors;
		});
	};

	function handleSubmit() {
		if (videoDialogueType === 'new') {
			//  dialog will close after successfull completion of series of api's
			const video = { ...form };
			if (videoFileRef.current) {
				[video.file] = videoFileRef.current.files;
			}
			if (videoThumbnailFileRef.current) {
				[video.fileThumbnail] = videoThumbnailFileRef.current.files;
			}
			video.category_id = categorySelectionRef.current; // Adding category_id from reference to form
			delete video.undefined; // Unexpected object on form;

			// User restriction data will fetch from action if it's flag is switched ( to avoid un necessary rendering )
			dispatch(addVideo({ video, dismissDialogue: true }));
		} else {
			// Edit video
			const video = { ...form, category_id: categorySelectionRef.current, id: formPersistRef.current.id }; // Adding material id,  category_id, from reference to form
			if (videoFileRef.current.files.length) {
				[video.file] = videoFileRef.current.files;
			}
			if (videoThumbnailFileRef.current) {
				[video.fileThumbnail] = videoThumbnailFileRef.current.files;
			}
			if (formPersistRef.current.category_id && formPersistRef.current.category_id !== video.category_id) {
				video.remove_category_id = formPersistRef.current.category_id;
			} else if (formPersistRef.current.category_id && formPersistRef.current.category_id === video.category_id) {
				delete video.category_id;
			}
			// if (formPersistRef.current.status_value === video.status_value) {
			// 	delete video.status_value;
			// }
			delete video.undefined; // Unexpected object on form;

			// User restrction flag
			if (formPersistRef.current.user_restriction && !video.user_restriction) {
				video.remove_user_restriction = true;
			}

			// User restriction data will fetch from action according to it's flag ( to avoid un necessary rendering )
			dispatch(updateVideo({ video, dismissDialogue: true }));
		}
	}

	function handleCancelUpload() {
		dispatch(cancelFileUpload());
	}

	const onFormChange = values => {
		if (values.video_file && !youtubeDisabled) {
			setYoutubeDisabled(true);
			formRef.current.updateInputsWithValue({
				youtube_link: ''
			});
		} else if (!values.video_file && youtubeDisabled) {
			setYoutubeDisabled(false);
		}
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...videoDialogueProps}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{videoDialogueLoading && (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading material ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!videoDialogueLoading && (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{videoDialogueType === 'new' ? 'New Video' : 'Edit Video'}
							</Typography>
						</Toolbar>
					</AppBar>
					<Formsy
						onValidSubmit={handleSubmit}
						onValid={enableButton}
						onInvalid={disableButton}
						isFormValid
						ref={formRef}
						onChange={onFormChange}
						className="flex flex-col md:overflow-hidden"
						validationErrors={externalValidationErrors}
					>
						<DialogContent classes={{ root: 'p-24' }}>
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">text_fields</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
									type="text"
									name="title"
									label="Title"
									value={form.title}
									validations={{
										maxLength: 120
									}}
									validationErrors={{
										maxLength: 'Exceeds maximum character limit 120'
									}}
									variant="outlined"
									onChange={handleChangeMiddleware}
									required
									fullWidth
								/>
							</div>
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">description</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
									type="text"
									name="description"
									label="Description"
									multiline
									rows={4}
									value={form.description}
									validations={{
										maxLength: 320
									}}
									validationErrors={{
										maxLength: 'Exceeds maximum character limit 320'
									}}
									variant="outlined"
									onChange={handleChangeMiddleware}
									required
									fullWidth
								/>
							</div>

							<div className="flex">
								<CategorySelect
									defaultCategoryId={form.category_id}
									categorySelectionRef={categorySelectionRef}
								/>
								<input
									ref={categoryElementRef}
									type="hidden"
									name="category_id"
									value={form.category_id}
								/>
							</div>

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">local_mall</Icon>
								</div>
								<ChipSelectFormsy
									name="package_ids"
									value={form.package_ids}
									options={
										packages
											? packages.map(item => ({
													label: item.package_title,
													value: item.package_id
											  }))
											: []
									}
									onChange={handleChangeMiddleware}
									label="Packages"
									className="mb-36"
								/>
							</div>
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">low_priority</Icon>
								</div>
								<div className="flex mb-16 flex-col flex-1">
									<TextFieldFormsy
										className="mb-4"
										type="text"
										name="serving_priority"
										label="Serving Priority"
										value={form.serving_priority}
										validations={{
											isNumeric: true
										}}
										validationErrors={{
											isNumeric: 'Must be a valid number'
										}}
										variant="outlined"
										onChange={handleChangeMiddleware}
										fullWidth
									/>
									<Typography className={classes.helperText} variant="body2" gutterBottom>
										The highest number have higher priority in serving order
									</Typography>
								</div>
							</div>

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">supervised_user_circle</Icon>
								</div>
								<div className="flex mb-16 flex-col flex-1">
									<div className="flex flex-col">
										<CheckboxFormsy
											className="mt-10"
											name="is_free"
											label="Is accessable on demo"
											value={form.is_free}
											onChange={handleChange}
										/>
										<Typography className={classes.helperText} variant="body2" gutterBottom>
											By checking this, the material will accessable to demo / free packages ( NB:
											This material should added to the demo package )
										</Typography>
									</div>
								</div>
							</div>

							{!process.env.REACT_APP_DISABLE_LEARNING_MATERIAL_USER_RESTRICTON ? (
								<div className="flex my-16">
									<div className="min-w-48 pt-20">
										<Icon color="action">supervised_user_circle</Icon>
									</div>
									<div className="flex mb-16 flex-col flex-1">
										<UserRestriction form={form} onChange={handleChangeMiddleware} />
									</div>
								</div>
							) : null}
							{process.env.REACT_APP_ENABLED_VIDEO_YOUTUBE ? (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<YouTubeIcon color="action" />
										{/* <Icon color="action">you_tube</Icon> */}
									</div>
									<div className="flex mb-16 flex-col flex-1">
										<TextFieldFormsy
											className="mb-4"
											type="text"
											name="youtube_link"
											label="Youtube video link"
											value={form.youtube_link}
											disabled={youtubeDisabled}
											variant="outlined"
											onChange={handleChangeMiddleware}
											fullWidth
											validations={
												videoDialogueType === 'new' ||
												(videoDialogueType === 'edit' &&
													formPersistRef.current &&
													formPersistRef.current.youtube_link)
													? {
															combinedValidationYoutubeLink: (values, value) => {
																return !!(values.video_file || value);
															}
													  }
													: undefined
											}
										/>
										<Typography className={classes.helperText} variant="body2" gutterBottom>
											Must be a valid youtube link
										</Typography>
									</div>
								</div>
							) : null}

							{!(
								typeof process.env.REACT_APP_ENABLED_VIDEO_FILE !== 'undefined' &&
								Number(process.env.REACT_APP_ENABLED_VIDEO_FILE) === 0
							) && (
								<>
									<div className="flex">
										<div className="min-w-48 pt-20">
											<Icon color="action">videocam</Icon>
										</div>
										<div className="flex mb-0 flex-col flex-1">
											<FileChooser
												className="mb-0"
												name="video_file"
												label="Video file"
												value={form.video_file}
												uploadInProgress={uploadInProgress}
												variant="outlined"
												acceptFileTypes="video/mp4,video/x-m4v,video/*"
												onChange={handleChangeMiddleware}
												ref={videoFileRef}
												validations={
													videoDialogueType === 'new' ||
													(videoDialogueType === 'edit' &&
														formPersistRef.current &&
														formPersistRef.current.youtube_link)
														? {
																combinedValidationFile: (values, value) => {
																	return !!(values.youtube_link || value);
																}
														  }
														: undefined
												}
												fullWidth
											/>
										</div>
									</div>
									<div className="flex">
										<div className="min-w-48 pt-20">
											<Icon color="action">image</Icon>
										</div>
										<div className="flex mb-16 flex-col flex-1">
											<FileChooser
												className="mb-24"
												name="video_thumbnail_file"
												label="Video thumbnail"
												value={form.video_thumbnail_file}
												uploadInProgress={uploadThumbnailInProgress}
												variant="outlined"
												acceptFileTypes="image/jpeg"
												onChange={handleChangeMiddleware}
												ref={videoThumbnailFileRef}
												fullWidth
												type="image"
												uploadPercentageSelector="state.liveEventApp.recordings.videoDialogue.uploadThumbnail.percentage"
											/>
										</div>
									</div>
								</>
							)}

							{/* <div className={clsx('flex', videoDialogueType !== 'new' && 'hidden')}>
								<VideoFile
									videoDialogueSubmitting={videoDialogueSubmitting}
									videoDialogueUploadInProgress={videoDialogueUploadInProgress}
									file={file}
									error={externalValidationErrors.file}
									setFile={setFile}
									ref={videoFileRef}
								/>
							</div> */}
						</DialogContent>

						{videoDialogueType === 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{videoDialogueSubmitting && uploadInProgress ? (
										<Button
											onClick={handleCancelUpload}
											variant="contained"
											color="primary"
											type="button"
										>
											Cancel Upload
										</Button>
									) : null}
									{videoDialogueSubmitting && !uploadInProgress ? (
										<Button
											disableElevation
											variant="contained"
											color="primary"
											type="button"
											disabled
										>
											Please wait ...{' '}
											<CircularProgress className="ml-16" size={22} color="inherit" />
										</Button>
									) : null}
									{!videoDialogueSubmitting ? (
										<Button
											variant="contained"
											color="primary"
											type="submit"
											disabled={!isFormValid}
										>
											Add
										</Button>
									) : null}
								</div>
							</DialogActions>
						) : null}
						{videoDialogueType !== 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{videoDialogueSubmitting && uploadInProgress ? (
										<Button
											onClick={handleCancelUpload}
											variant="contained"
											color="primary"
											type="button"
										>
											Cancel Upload
										</Button>
									) : null}
									{videoDialogueSubmitting && !uploadInProgress ? (
										<Button
											disableElevation
											variant="contained"
											color="primary"
											type="button"
											disabled
										>
											Please wait ...{' '}
											<CircularProgress className="ml-16" size={22} color="inherit" />
										</Button>
									) : null}
									{!videoDialogueSubmitting ? (
										<Button
											variant="contained"
											color="primary"
											type="submit"
											onClick={handleChangeMiddleware}
											disabled={!isFormValid}
										>
											Save
										</Button>
									) : null}
								</div>
							</DialogActions>
						) : null}
					</Formsy>
				</>
			)}
		</Dialog>
	);
}

export default VideoDialog;
