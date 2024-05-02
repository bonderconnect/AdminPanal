import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuestions } from '../../store/questionsSlice';

const useStyles = makeStyles({
	autoSaveIndicatorHolder: {
		height: 6
	}
});

const BottomActions = props => {
	const classes = useStyles();
	const { learningMaterialId } = props;
	const questionsUpdating = useSelector(state => state.examApp.questions.updating);
	const autoSaving = useSelector(state => state.examApp.questions.autoSaving);
	const dispatch = useDispatch();

	useEffect(() => {
		const autosaveTimer = setInterval(() => {
			handleUpdate(true);
		}, 40000);

		return () => {
			clearInterval(autosaveTimer);
		};
	}, []);

	const handleUpdate = isAutoSave => {
		const questionsObjArr = [];
		let iterateQuestionIndex = 0;
		while (true) {
			const questionElement = document.getElementById(`qn-textfield-withindex-${iterateQuestionIndex}`);
			if (!questionElement) {
				break;
			}

			const questionObj = {
				id: questionElement.getAttribute('data-id'),
				temp_id: questionElement.getAttribute('data-temp_id'),
				question: questionElement.value,
				options: [],
				score: document.getElementById(`score-of-qn-${iterateQuestionIndex}`).value,
				type: document.getElementById(`type-of-qn-${iterateQuestionIndex}`).value,
				serving_priority: iterateQuestionIndex + 1
			};

			if (questionObj.type === 'mcq') {
				let iterateQuestionOptionIndex = 0;
				while (true) {
					const questionOptionElement = document.getElementById(
						`option-of-qn-${iterateQuestionIndex}-optionindex-${iterateQuestionOptionIndex}`
					);
					if (!questionOptionElement) {
						break;
					}

					const questionOptionObj = {
						id: questionOptionElement.getAttribute('data-id'),
						temp_id: questionOptionElement.getAttribute('data-temp_id'),
						option_text: questionOptionElement.value,
						is_right_option: document.getElementById(
							`option-checked-of-qn-${iterateQuestionIndex}-optionindex-${iterateQuestionOptionIndex}`
						).checked,
						serving_priority: iterateQuestionOptionIndex + 1
					};

					questionObj.options.push(questionOptionObj);

					iterateQuestionOptionIndex += 1;
				}
			}

			questionsObjArr.push(questionObj);

			iterateQuestionIndex += 1;
		}

		dispatch(
			updateQuestions({
				learningMaterialId,
				updatedQuestionsArr: questionsObjArr,
				isAutoSave
			})
		);
	};

	return (
		<>
			<div className={classes.autoSaveIndicatorHolder}>{autoSaving ? <LinearProgress /> : null}</div>
			<Paper elevation={0} className="mt-8 p-12 flex justify-end">
				{questionsUpdating && !autoSaving ? (
					<Button size="large" disableElevation variant="contained" color="primary" type="button" disabled>
						Please wait ... <CircularProgress className="ml-16" size={22} color="inherit" />
					</Button>
				) : (
					<Button
						onClick={() => setTimeout(() => handleUpdate(), 0)}
						variant="contained"
						size="large"
						color="primary"
						endIcon={<Icon>save</Icon>}
					>
						Update
					</Button>
				)}
			</Paper>
		</>
	);
};

export default BottomActions;
