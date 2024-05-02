import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChipSelectFormsy from '@fuse/core/formsy/ChipSelectFormsy';
import { TextFieldFormsy, SelectFormsy, CheckboxFormsy } from '@fuse/core/formsy';
import { makeStyles } from '@material-ui/core/styles';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addNote,
	updateNote,
	closeNewNoteDialog,
	closeEditNoteDialog,
	cancelFileUpload
} from '../store/noteDialogueSlice';
import CategorySelect from './CategorySelect';
import { selectPackages } from '../store/packageSlice';
import FileChooser from './FileChooser';

const useStyles = makeStyles(theme => ({
	helperText: {
		fontSize: 12,
		fontStyle: 'italic'
	}
}));

const defaultFormState = {
	title: '',
	description: '',
	status_value: '',
	category_id: '',
	package_ids: [],
	serving_priority: 0,
	note_file: '',
	is_free: false
};
/** NB: this component contains shit code, so please make sure that you will not break anything while changeing
 * and make sure that you're well aware of what you're adding & removing in this component. - Early dev :)
 */
function NoteDialog(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const {
		type: noteDialogueType,
		form: noteDialogueForm,
		props: noteDialogueProps,
		errors: noteDialogueErrors,
		submitting: noteDialogueSubmitting,
		loading: noteDialogueLoading,
		upload: { inProgress: uploadInProgress }
	} = useSelector(({ noteApp }) => noteApp.noteDialogue);
	const [isFormValid, setIsFormValid] = useState(false);
	const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
	const packages = useSelector(selectPackages);
	const categorySelectionRef = useRef(null);
	const categoryElementRef = useRef(null);
	const formPersistRef = useRef(null);
	const noteFileRef = useRef(null);
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
		if (noteDialogueType === 'edit' && noteDialogueForm) {
			setForm({ ...noteDialogueForm });
			categorySelectionRef.current = noteDialogueForm.category_id;
			formPersistRef.current = { ...noteDialogueForm };
		}

		/**
		 * Dialog type: 'new'
		 */
		if (noteDialogueType === 'new') {
			setForm({
				...defaultFormState,
				...noteDialogueForm
			});
		}
	}, [noteDialogueForm, noteDialogueType, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (noteDialogueProps.open && noteDialogueType === 'new') {
			initDialog();
		} else if (noteDialogueProps.open && noteDialogueType === 'edit' && noteDialogueForm) {
			initDialog();
		}
	}, [noteDialogueProps.open, noteDialogueForm, initDialog]);

	useEffect(() => {
		/**
		 * Listening to server side validations
		 */

		const validationErrors = {};
		Object.keys(noteDialogueErrors).forEach(errorField => {
			validationErrors[errorField] = noteDialogueErrors[errorField].error;
		});
		setExternalValidationErrors(validationErrors);
	}, [noteDialogueErrors]);

	function closeComposeDialog() {
		if (!noteDialogueSubmitting) {
			return noteDialogueType === 'edit' ? dispatch(closeEditNoteDialog()) : dispatch(closeNewNoteDialog());
		}
		return null;
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	const handleChangeMiddleware = ev => {
		handleChange(ev);
		const { target } = ev;

		setExternalValidationErrors(state => {
			const updatedErrors = { ...state };
			if (
				noteDialogueErrors[target.name] &&
				noteDialogueErrors[target.name].error &&
				noteDialogueErrors[target.name].withValue === target.value
			) {
				updatedErrors[target.name] = noteDialogueErrors[target.name].error;
			} else {
				delete updatedErrors[target.name];
			}
			return updatedErrors;
		});
	};

	function handleSubmit() {
		if (noteDialogueType === 'new') {
			//  dialog will close after successfull completion of series of api's
			const note = { ...form };
			[note.file] = noteFileRef.current.files;
			note.category_id = categorySelectionRef.current; // Adding category_id from reference to form
			delete note.undefined; // Unexpected object on form;
			dispatch(addNote({ note, dismissDialogue: true }));
		} else {
			// Edit note
			const note = { ...form, category_id: categorySelectionRef.current, id: formPersistRef.current.id }; // Adding material id,  category_id, from reference to form
			if (noteFileRef.current.files.length) {
				[note.file] = noteFileRef.current.files;
			}
			if (formPersistRef.current.category_id && formPersistRef.current.category_id !== note.category_id) {
				note.remove_category_id = formPersistRef.current.category_id;
			} else if (formPersistRef.current.category_id && formPersistRef.current.category_id === note.category_id) {
				delete note.category_id;
			}
			if (formPersistRef.current.status_value === note.status_value) {
				delete note.status_value;
			}
			delete note.undefined; // Unexpected object on form;
			dispatch(updateNote({ note, dismissDialogue: true }));
		}
	}

	function handleCancelUpload() {
		dispatch(cancelFileUpload());
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...noteDialogueProps}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{noteDialogueLoading && (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading material ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!noteDialogueLoading && (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{noteDialogueType === 'new' ? 'New Note' : 'Edit Note'}
							</Typography>
						</Toolbar>
					</AppBar>
					<Formsy
						onValidSubmit={handleSubmit}
						onValid={enableButton}
						onInvalid={disableButton}
						// onInvalidSubmit={(e, e2) => console.log('invalid submit', e, e2)}
						isFormValid
						ref={formRef}
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
									<Icon color="action">adjust</Icon>
								</div>

								<SelectFormsy
									className="mb-16 flex-1"
									name="status_value"
									label="Status"
									value={form.status_value}
									variant="outlined"
									autoWidth
									onChange={handleChangeMiddleware}
								>
									{statusSelectionoptions.map(item => (
										<MenuItem key={`-${item.value}`} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</SelectFormsy>
							</div>

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">low_priority</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
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
									helperText="The highest number have higher priority in serving order"
									variant="outlined"
									onChange={handleChangeMiddleware}
									fullWidth
								/>
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

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">videocam</Icon>
								</div>
								<div className="flex mb-16 flex-col flex-1">
									<FileChooser
										className="mb-24"
										name="note_file"
										label="Note File"
										value={form.note_file}
										uploadInProgress={uploadInProgress}
										variant="outlined"
										acceptFileTypes="application/pdf"
										onChange={handleChangeMiddleware}
										ref={noteFileRef}
										required={noteDialogueType === 'new'}
										fullWidth
									/>
									{/* <FileChooserFormsy /> */}
									{/* <Typography className={classes.servingPriorityHelper} variant="body2" gutterBottom>
										If file is uploaded youtube link we
									</Typography> */}
								</div>
							</div>
						</DialogContent>

						{noteDialogueType === 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{noteDialogueSubmitting && uploadInProgress ? (
										<Button
											onClick={handleCancelUpload}
											variant="contained"
											color="primary"
											type="button"
										>
											Cancel Upload
										</Button>
									) : null}
									{noteDialogueSubmitting && !uploadInProgress ? (
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
									{!noteDialogueSubmitting ? (
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
						{noteDialogueType !== 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{noteDialogueSubmitting && uploadInProgress ? (
										<Button
											onClick={handleCancelUpload}
											variant="contained"
											color="primary"
											type="button"
										>
											Cancel Upload
										</Button>
									) : null}
									{noteDialogueSubmitting && !uploadInProgress ? (
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
									{!noteDialogueSubmitting ? (
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

export default NoteDialog;
