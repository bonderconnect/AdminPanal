import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import update from 'immutability-helper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TextFieldFormsy, SelectFormsy, CkeditorFormsy } from '@fuse/core/formsy';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { getExam, closeExamQuestionOptionsDialog, updateExamQuestionOptions } from '../store/examQuestionsSlice';

const defaultFormState = {
	options: [],
	rightOptionId: null
};

const useStyles = makeStyles(theme => ({
	servingPriorityHelper: {
		fontSize: 12,
		fontStyle: 'italic'
	},
	noOptionsText: {
		color: '#808B96'
	}
}));

function ExamQuestionOptionsDialogue(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { examQuestionOptionsDialogue, learningMaterial } = useSelector(({ examApp }) => examApp.examQuestions);
	const [isFormValid, setIsFormValid] = useState(false);

	const [form, setForm] = useState(defaultFormState);

	const handleChange = (index, field, val, ev) => {
		setForm(state => {
			let updatedState = { ...state };
			switch (field) {
				case 'serving_priority':
					updatedState = update(updatedState, {
						options: { [index]: { serving_priority: { $set: val || ev.currentTarget.value } } }
					});
					break;

				case 'option_text':
					updatedState = update(updatedState, {
						options: { [index]: { option_text: { $set: val || ev.target.value } } }
					});
					break;

				case 'is_right_option':
					updatedState.rightOptionId = updatedState.options[index].id || updatedState.options[index].tempId;
					break;

				default:
					break;
			}

			return updatedState;
		});
	};

	const addNewOption = () => {
		setForm(state => {
			const lastOptionServingPriority =
				(state.options[state.options.length - 1] && state.options[state.options.length - 1].serving_priority) ||
				0;

			const tempId = FuseUtils.generateGUID();

			const updatedState = {
				...state,
				options: [
					...state.options,
					{
						tempId,
						option_text: '',
						serving_priority: lastOptionServingPriority + 1
					}
				]
			};

			if (!state.options.length) {
				updatedState.rightOptionId = tempId;
			}

			return updatedState;
		});
	};

	const onRemoveOption = index => {
		setForm(state => {
			const updatedOptions = [...state.options];
			if (updatedOptions[index].id || updatedOptions[index].tempId === updatedOptions.isRightOptionId) {
				updatedOptions.isRightOptionId = null;
			}
			const splicedItems = updatedOptions.splice(index, 1);
			const removedItem = splicedItems[0];
			const updatedState = { ...state, options: updatedOptions };
			if (state.rightOptionId === (removedItem.id || removedItem.tempId)) {
				updatedState.rightOptionId = null;
			}
			return updatedState;
		});
	};

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (examQuestionOptionsDialogue.type === 'edit' && examQuestionOptionsDialogue.data) {
			const { data } = examQuestionOptionsDialogue;
			setForm(state => {
				const updatedState = { ...state, ...defaultFormState };
				if (data.options && data.options.length) {
					updatedState.options = data.options;
				}
				if (data.questionAnswerOptionId) {
					updatedState.rightOptionId = data.questionAnswerOptionId;
				}
				return updatedState;
			});
		}

		/**
		 * Dialog type: 'new'
		 */
		if (examQuestionOptionsDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...examQuestionOptionsDialogue.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [examQuestionOptionsDialogue.data, examQuestionOptionsDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (examQuestionOptionsDialogue.props.open) {
			initDialog();
		}
	}, [examQuestionOptionsDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return dispatch(closeExamQuestionOptionsDialog());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		const isFormValidExtra = !!form.rightOptionId;
		setIsFormValid(isFormValidExtra && true);
	}

	function handleSubmit() {
		const newOptions = [];
		const updatedOptions = [];
		const removedOptionsIds = [];

		const { data } = examQuestionOptionsDialogue;

		const nonDeletedOptionsIds = [];

		form.options.forEach(item => {
			if (item.tempId) {
				const optionObj = {
					option_text: item.option_text,
					is_right_option: form.rightOptionId === item.tempId,
					serving_priority: item.serving_priority
				};
				newOptions.push(optionObj);
			}

			if (item.id) {
				nonDeletedOptionsIds.push(item.id);
			}
		});

		if (data.options) {
			data.options.forEach(item => {
				if (nonDeletedOptionsIds.length && nonDeletedOptionsIds.indexOf(item.id) === -1) {
					removedOptionsIds.push(item.id);
				} else {
					updatedOptions.push({
						id: item.id,
						option_text: item.option_text,
						serving_priority: item.serving_priority,
						is_right_option: form.rightOptionId === item.id
					});
				}
			});
		}

		const callback = () => {
			closeComposeDialog();
			dispatch(
				getExam({
					learningMaterialId,
					hideLoadingIndication: true
				})
			);
		};

		const learningMaterialId = learningMaterial.learning_material_id;
		const { learningMaterialExamQuestionId } = data;
		dispatch(
			updateExamQuestionOptions({
				newOptions,
				updatedOptions,
				removedOptionsIds,
				learningMaterialId,
				learningMaterialExamQuestionId,
				callback
			})
		);
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...examQuestionOptionsDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Edit Question Options
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
					{form.options && form.options.length ? (
						form.options.map((item, index) => {
							return (
								<div key={`_${item.id}`} className="flex">
									<div className="min-w-48 pt-48 pr-16">
										<IconButton
											onClick={() => onRemoveOption(index)}
											color="primary"
											aria-label="add an alarm"
										>
											<Icon color="action">delete</Icon>
										</IconButton>
									</div>

									<div className="flex flex-col flex-1">
										<CkeditorFormsy
											value={item.option_text}
											name="option"
											label={`Option ${index + 1}`}
											validations={{
												minLength: 1
											}}
											validationErrors={{
												minLength: 'Min character length is 1',
												required: 'Description is required'
											}}
											onChange={ev => handleChange(index, 'option_text', null, ev)}
											editorProps={{
												imageUpload: true,
												learningMaterialId:
													learningMaterial && learningMaterial.learning_material_id
											}}
											required
										/>
										<div className="flex items-center">
											<div className="flex">
												<TextFieldFormsy
													type="text"
													name="serving_priority"
													label="Serving priority"
													value={item.serving_priority}
													validations={{
														isNumeric: true
													}}
													validationErrors={{
														isNumeric: 'Must be a valid number'
													}}
													variant="outlined"
													onChange={ev => handleChange(index, 'serving_priority', null, ev)}
													required
												/>
											</div>
											<div className="flex">
												<FormControlLabel
													control={
														<Switch
															checked={form.rightOptionId === (item.id || item.tempId)}
															onChange={ev =>
																handleChange(index, 'is_right_option', null, ev)
															}
															name="checkedB"
															color="primary"
														/>
													}
													labelPlacement="start"
													label="Is right option :"
												/>
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="flex flex-1 justify-center">
							<Typography
								className={clsx('italic text-base mt-12', classes.noOptionsText)}
								variant="body1"
								gutterBottom
							>
								No Options, click on 'ADD NEW OPTION' to create one.
							</Typography>
						</div>
					)}
				</DialogContent>
				<DialogActions className="justify-between p-8">
					<div className="flex flex-1 justify-between">
						<div className="px-16">
							{examQuestionOptionsDialogue.submitting ? (
								<Button disableElevation variant="contained" color="primary" type="button" disabled>
									Please wait ... <CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : null}
							{!examQuestionOptionsDialogue.submitting && form.options.length ? (
								<div className="px-16">
									<Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
										Save
									</Button>
								</div>
							) : null}
						</div>
						<div className="px-16">
							<Button
								onClick={addNewOption}
								endIcon={<Icon color="action">add</Icon>}
								variant="contained"
								type="button"
							>
								Add new option
							</Button>
						</div>
					</div>
				</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default ExamQuestionOptionsDialogue;
