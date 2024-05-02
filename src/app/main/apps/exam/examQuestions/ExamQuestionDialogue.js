import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TextFieldFormsy, SelectFormsy, CkeditorFormsy } from '@fuse/core/formsy';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateExamQuestion,
	addExamQuestion,
	closeNewExamQuestionDialog,
	closeEditExamQuestionDialog,
	getExam,
	getExamQuestions
} from '../store/examQuestionsSlice';

const defaultFormState = {
	question_id: '',
	question: '',
	explanation: '',
	score: '',
	serving_priority: ''
};

const useStyles = makeStyles(theme => ({
	servingPriorityHelper: {
		fontSize: 12,
		fontStyle: 'italic'
	}
}));

function ExamQuestionDialogue(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { examQuestionDialogue, learningMaterial } = useSelector(({ examApp }) => examApp.examQuestions);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (examQuestionDialogue.type === 'edit' && examQuestionDialogue.data) {
			setForm({ ...examQuestionDialogue.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (examQuestionDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...examQuestionDialogue.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [examQuestionDialogue.data, examQuestionDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (examQuestionDialogue.props.open) {
			initDialog();
		}
	}, [examQuestionDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return examQuestionDialogue.type === 'edit'
			? dispatch(closeEditExamQuestionDialog())
			: dispatch(closeNewExamQuestionDialog());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit() {
		if (examQuestionDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addQuestionPayload = { ...form };
			delete addQuestionPayload.question_id;
			delete addQuestionPayload.id;
			delete addQuestionPayload[''];

			const callback = () => {
				closeComposeDialog();
				dispatch(
					getExam({
						learningMaterialId,
						hideLoadingIndication: true
					})
				);
				// dispatch(getExamQuestions({ learningMaterialId }));
				// dispatch(updateQuestionCount(Number(learningMaterial.question_count) + 1));
			};
			const learningMaterialId = learningMaterial.learning_material_id;
			dispatch(addExamQuestion({ question: addQuestionPayload, learningMaterialId, callback }));
		} else {
			const updateQuestionPayload = { ...form };
			const learningMaterialExamQuestionId = updateQuestionPayload.question_id;
			delete updateQuestionPayload.question_id;
			delete updateQuestionPayload.id;
			delete updateQuestionPayload[''];

			const callback = () => {
				closeComposeDialog();
				dispatch(
					getExam({
						learningMaterialId,
						hideLoadingIndication: true
					})
				);
				dispatch(getExamQuestions({ learningMaterialId }));
			};
			const learningMaterialId = learningMaterial.learning_material_id;
			dispatch(
				updateExamQuestion({
					question: updateQuestionPayload,
					learningMaterialId,
					learningMaterialExamQuestionId,
					callback
				})
			);
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...examQuestionDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{examQuestionDialogue.type === 'new' ? 'New Question' : 'Edit Question'}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className="flex flex-col md:overflow-hidden"
			>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-48">
							<Icon color="action">description</Icon>
						</div>

						<CkeditorFormsy
							value={form.question}
							name="question"
							label="Question *"
							validations={{
								minLength: 6
							}}
							validationErrors={{
								minLength: 'Min character length is 6',
								required: 'Description is required'
							}}
							onChange={handleChange}
							editorProps={{
								imageUpload: true,
								learningMaterialId: learningMaterial && learningMaterial.learning_material_id
							}}
							required
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-48">
							<Icon color="action">description</Icon>
						</div>

						<CkeditorFormsy
							value={form.explanation}
							name="explanation"
							label="Answer explanation"
							onChange={handleChange}
							editorProps={{
								imageUpload: true,
								learningMaterialId: learningMaterial && learningMaterial.learning_material_id
							}}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">show_chart</Icon>
						</div>
						<TextFieldFormsy
							className="mb-24"
							type="text"
							name="score"
							label="Score"
							value={form.score}
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
							<Typography className={classes.servingPriorityHelper} variant="body2" gutterBottom>
								The Lowest number have higher priority in serving order
							</Typography>
						</div>
					</div>
				</DialogContent>
				{examQuestionDialogue.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{examQuestionDialogue.submitting ? (
								<Button disableElevation variant="contained" color="primary" type="button" disabled>
									Please wait ... <CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={handleChange}
									type="submit"
									disabled={!isFormValid}
								>
									Add
								</Button>
							)}
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
								Save
							</Button>
						</div>
					</DialogActions>
				)}
			</Formsy>
		</Dialog>
	);
}

export default ExamQuestionDialogue;
