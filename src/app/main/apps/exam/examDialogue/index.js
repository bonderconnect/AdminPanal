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
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addExam,
	updateExam,
	closeNewExamDialog,
	closeEditExamDialog,
	cancelFileUpload
} from '../store/examDialogueSlice';
import CategorySelect from './CategorySelect';
import { selectPackages } from '../store/packageSlice';
import UserRestriction from './userRestriction';
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
	// status_value: '',
	category_id: '',
	serving_priority: 0,
	duration: '',
	file: '',
	user_restriction: false,
	package_ids: [],
	is_free: false,
	is_manual_evaluation: false
};
/** NB: this component contains shit code, so please make sure that you will not break anything while changeing
 * and make sure that you're well aware of what you're adding & removing in this component. - Early dev :)
 */
function ExamDialog(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const {
		type: examDialogueType,
		form: examDialogueForm,
		props: examDialogueProps,
		errors: examDialogueErrors,
		submitting: examDialogueSubmitting,
		loading: examDialogueLoading,
		upload: { inProgress: uploadInProgress }
	} = useSelector(({ examApp }) => examApp.examDialogue);
	const [isFormValid, setIsFormValid] = useState(false);
	const packages = useSelector(selectPackages);
	const categorySelectionRef = useRef(null);
	const categoryElementRef = useRef(null);
	const formPersistRef = useRef(null);
	const examQuestionsExcelFileRef = useRef(null);
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
		if (examDialogueType === 'edit' && examDialogueForm) {
			setForm({ ...examDialogueForm });
			categorySelectionRef.current = examDialogueForm.category_id;
			formPersistRef.current = { ...examDialogueForm };
		}

		/**
		 * Dialog type: 'new'
		 */
		if (examDialogueType === 'new') {
			setForm({
				...defaultFormState,
				...examDialogueForm
			});
		}
	}, [examDialogueForm, examDialogueType, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (examDialogueProps.open && examDialogueType === 'new') {
			initDialog();
		} else if (examDialogueProps.open && examDialogueType === 'edit' && examDialogueForm) {
			initDialog();
		}
	}, [examDialogueProps.open, examDialogueForm, initDialog]);

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
		Object.keys(examDialogueErrors).forEach(errorField => {
			validationErrors[errorField] = examDialogueErrors[errorField].error;
		});
		setExternalValidationErrors(validationErrors);
	}, [examDialogueErrors]);

	function closeComposeDialog() {
		if (!examDialogueSubmitting) {
			return examDialogueType === 'edit' ? dispatch(closeEditExamDialog()) : dispatch(closeNewExamDialog());
		}
		return null;
	}

	function handleSubmit() {
		if (examDialogueType === 'new') {
			//  dialog will close after successfull completion of series of api's
			const exam = { ...form };
			if (examQuestionsExcelFileRef.current.files.length) {
				[exam.questionsExcelFile] = examQuestionsExcelFileRef.current.files;
			}
			exam.category_id = categorySelectionRef.current; // Adding category_id from reference to form
			delete exam.undefined; // Unexpected object on form;

			const callback = () => {
				dispatch(closeNewExamDialog());
			};

			// User restriction data will fetch from action if it's flag is switched ( to avoid un necessary rendering )
			dispatch(addExam({ exam, callback }));
		} else {
			// Edit exam
			const exam = { ...form, category_id: categorySelectionRef.current, id: formPersistRef.current.id }; // Adding material id,  category_id, from reference to form

			if (formPersistRef.current.category_id && formPersistRef.current.category_id !== exam.category_id) {
				exam.remove_category_id = formPersistRef.current.category_id;
			} else if (formPersistRef.current.category_id && formPersistRef.current.category_id === exam.category_id) {
				delete exam.category_id;
			}
			// if (formPersistRef.current.status_value === exam.status_value) {
			// 	delete exam.status_value;
			// }
			delete exam.undefined; // Unexpected object on form;

			// User restrction flag
			if (formPersistRef.current.user_restriction && !exam.user_restriction) {
				exam.remove_user_restriction = true;
			}

			// User restriction data will fetch from action according to it's flag ( to avoid un necessary rendering )
			dispatch(updateExam({ exam, dismissDialogue: true }));
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
			{...examDialogueProps}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{examDialogueLoading && (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading material ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!examDialogueLoading && (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{examDialogueType === 'new' ? 'New Exam' : 'Edit Exam'}
							</Typography>
						</Toolbar>
					</AppBar>
					<Formsy
						onValidSubmit={handleSubmit}
						onValid={enableButton}
						onInvalid={disableButton}
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
									onChange={handleChange}
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
									onChange={handleChange}
									required
									fullWidth
								/>
							</div>

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">query_builder</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
									type="text"
									name="duration"
									label="Duration ( In mins )"
									value={form.duration}
									validations={{
										isNumeric: true
									}}
									validationErrors={{
										isNumeric: 'Must be a valid number'
									}}
									variant="outlined"
									onChange={handleChange}
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
									onChange={handleChange}
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
										onChange={handleChange}
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
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">playlist_add_check</Icon>
								</div>
								<div className="flex mb-16 flex-col flex-1">
									<div className="flex flex-col">
										<CheckboxFormsy
											className="mt-10"
											name="is_manual_evaluation"
											label="Is manual evaluation"
											value={form.is_manual_evaluation}
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>
							{!process.env.REACT_APP_DISABLE_LEARNING_MATERIAL_USER_RESTRICTON ? (
								<div className="flex my-16">
									<div className="min-w-48 pt-20">
										<Icon color="action">supervised_user_circle</Icon>
									</div>
									<div className="flex mb-16 flex-col flex-1">
										<UserRestriction form={form} onChange={handleChange} />
									</div>
								</div>
							) : null}
							{examDialogueType === 'new' ? (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">grid_on</Icon>
									</div>
									<div className="flex mb-16 flex-col flex-1">
										<FileChooser
											className="mb-24"
											name="questions_excel_file"
											label="Question excel import file"
											value={form.questions_excel_file}
											uploadInProgress={uploadInProgress}
											variant="outlined"
											acceptFileTypes="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
											onChange={handleChange}
											ref={examQuestionsExcelFileRef}
											fullWidth
										/>
									</div>
								</div>
							) : null}
						</DialogContent>

						{examDialogueType === 'new' ? (
							<DialogActions className="justify-end p-8">
								<div className="px-16">
									{examDialogueSubmitting ? (
										<Button
											disableElevation
											variant="contained"
											color="primary"
											type="button"
											disabled
										>
											Please wait ...
											<CircularProgress className="ml-16" size={22} color="inherit" />
										</Button>
									) : null}
									{!examDialogueSubmitting ? (
										<Button
											variant="contained"
											color="primary"
											type="submit"
											disabled={!isFormValid}
											endIcon={<Icon>chevron_right</Icon>}
										>
											Save
										</Button>
									) : null}
								</div>
							</DialogActions>
						) : null}
						{examDialogueType !== 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{examDialogueSubmitting && !uploadInProgress ? (
										<Button
											disableElevation
											variant="contained"
											color="primary"
											type="button"
											disabled
										>
											Please wait ...
											<CircularProgress className="ml-16" size={22} color="inherit" />
										</Button>
									) : null}
									{!examDialogueSubmitting ? (
										<Button
											variant="contained"
											color="primary"
											type="submit"
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

export default ExamDialog;
