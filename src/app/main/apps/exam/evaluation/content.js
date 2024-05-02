import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TextField from '@material-ui/core/TextField';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAllChoosedOptions,
	selectAllQuestions,
	selectChoosedOptionByQuestionId,
	selectQuestionAnswerByQuestionId,
	updateEvaluation
} from '../store/evaluationSlice';

const useStyles = makeStyles(theme => ({
	questionCol: {
		width: '30%'
	},
	optionsCol: {
		width: '40%'
	},
	optionTd: {
		paddingBottom: 20
	},
	optionRadio: {
		marginRight: 4
	},
	optionChoosedText: {
		color: '#3b3b3b',
		fontWeight: 'bold'
	},
	rightAnswerText: {
		color: '#1b8700',
		fontWeight: 'bold'
	},
	wronglyAnswereredText: {
		color: '#aa0d05',
		fontWeight: 'bold'
	},
	scoreInput: {
		width: 100
	},
	notificationText: {
		fontSize: 12,
		color: '#787878'
	},
	saveWrapper: {
		width: 160
	}
}));

const Content = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const choosedOptions = useSelector(selectAllChoosedOptions);
	const questions = useSelector(selectAllQuestions);
	const evaluated = useSelector(
		state => state.examApp.evaluation.userAttempt && state.examApp.evaluation.userAttempt.evaluated
	);
	const updateEvaluationProgressing = useSelector(state => state.examApp.evaluation.updateEvaluationProgressing);

	useEffect(() => {
		if (questions && questions.length && choosedOptions && choosedOptions.length) {
			// eslint-disable-next-line no-plusplus
			for (let index = 0; index < choosedOptions.length; index++) {
				const choosedOptionObj = choosedOptions[index];
				if (
					document.getElementById(
						`evaluation-feedback-field-of-${choosedOptionObj.learning_material_exam_question_id}`
					)
				) {
					document.getElementById(
						`evaluation-feedback-field-of-${choosedOptionObj.learning_material_exam_question_id}`
					).value = choosedOptionObj.evaluation_feedback;
				}

				if (document.getElementById(`score-field-of-${choosedOptionObj.learning_material_exam_question_id}`)) {
					document.getElementById(
						`score-field-of-${choosedOptionObj.learning_material_exam_question_id}`
					).value = choosedOptionObj.evaluation_score;
				}
			}
		}
	}, [choosedOptions, questions]);

	useEffect(() => {
		if (evaluated) {
			setIsMarkedAsEvaluated(true);
		}
	}, [evaluated]);

	const [isMarkedAsEvaluated, setIsMarkedAsEvaluated] = useState(false);

	const handleSave = () => {
		const evaluationQuestions = [];
		// eslint-disable-next-line no-plusplus
		for (let index = 0; index < questions.length; index++) {
			const questionObj = questions[index];
			if (questionObj.type === 'descriptive') {
				const evaluationQuestionObj = {
					question_id: questionObj.id,
					evaluation_feedback: document.getElementById(`evaluation-feedback-field-of-${questionObj.id}`)
						.value,
					evaluation_score: document.getElementById(`score-field-of-${questionObj.id}`).value
				};
				evaluationQuestions.push(evaluationQuestionObj);
			}
		}
		const payload = {
			isMarkedAsEvaluated,
			evaluationQuestions
		};
		dispatch(updateEvaluation(payload));
	};

	return (
		<>
			<div className={clsx('flex flex-1 flex-col p-12')}>
				<Typography className="mb-12 ml-4 mt-12" variant="h6" gutterBottom>
					Questions
				</Typography>
			</div>
			<div className="flex flex-col ">
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Question</TableCell>
								<TableCell align="center">
									<div className="flex flex-col">
										<span>Options /</span>
										<span>Answer</span>
									</div>
								</TableCell>
								<TableCell align="center">Question score</TableCell>
								<TableCell align="center">Obtained score</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{questions.map((item, index) => {
								return <QuestionTableRow item={item} index={index} />;
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<Paper elevation={0} className="flex py-32 px-24 mt-8 mb-16 justify-end items-center">
					<div className="flex flex-col items-end mr-16">
						<div>
							<FormControlLabel
								control={
									<Checkbox
										checked={isMarkedAsEvaluated}
										onChange={() => setIsMarkedAsEvaluated(!isMarkedAsEvaluated)}
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>
								}
								label="Mark as evaluation completed"
							/>
						</div>
						<span className={classes.notificationText}>
							( will send notification to user when saving as evaluation completed )
						</span>
					</div>
					<div className={clsx(classes.saveWrapper, 'flex justify-end')}>
						{updateEvaluationProgressing ? (
							<Button disabled size="large" color="primary">
								Please wait ...
							</Button>
						) : null}
						{!updateEvaluationProgressing ? (
							<Button onClick={handleSave} size="large" variant="contained" color="primary">
								Update
							</Button>
						) : null}
					</div>
				</Paper>
			</div>
		</>
	);
};

const QuestionTableRow = props => {
	const classes = useStyles();
	const { item, index } = props;
	const questionChoosedOption = useSelector(state => selectChoosedOptionByQuestionId(state, item.id));
	const questionAnswer = useSelector(state => selectQuestionAnswerByQuestionId(state, item.id));

	let isRightlyAnswered;

	return (
		<>
			<TableRow key={item.id}>
				<TableCell component="th" scope="row">
					{index + 1}
				</TableCell>
				<TableCell className={classes.questionCol}>{item.question}</TableCell>
				<TableCell className={classes.optionsCol} align="left">
					{item.type !== 'descriptive' && item.options && item.options.length ? (
						<table>
							<body>
								{item.options.map(optionItem => {
									const isChoosed =
										questionChoosedOption &&
										questionChoosedOption.learning_material_exam_question_option_id ===
											optionItem.id;
									const isRightOption = questionAnswer && questionAnswer.id === optionItem.id;

									if (isChoosed && isRightOption && !isRightlyAnswered) {
										isRightlyAnswered = true;
									}

									return (
										<tr key={`_${optionItem.id}`}>
											<td className={classes.optionTd}>
												<div className="flex">
													<div className={classes.optionRadio}>
														<Icon color="#000000">radio_button_unchecked</Icon>
													</div>
													<div className="flex flex-col">
														<div>{optionItem.option_text}</div>
														{isChoosed || isRightOption ? (
															<div className="mt-2 mb-4 flex flex-col">
																{isChoosed ? (
																	<span className={classes.optionChoosedText}>
																		choosed
																	</span>
																) : null}
																{isRightOption ? (
																	<span className={classes.rightAnswerText}>
																		right answer
																	</span>
																) : null}
																{isChoosed && !isRightOption ? (
																	<span className={classes.wronglyAnswereredText}>
																		( wrongly answered )
																	</span>
																) : null}
															</div>
														) : null}
													</div>
												</div>
											</td>
										</tr>
									);
								})}
							</body>
						</table>
					) : null}
					{item.type === 'descriptive' ? (
						<div className="flex flex-col">
							<div className="flex mb-12">
								<TextField
									className="flex-1"
									inputProps={{ readOnly: true }}
									label="Answer"
									variant="outlined"
									value={questionChoosedOption && questionChoosedOption.descriptive_answer}
									multiline
									rows="3"
								/>
							</div>
							<div className="flex">
								<TextField
									className="flex-1"
									label="Evaluation feedback"
									variant="outlined"
									inputProps={{
										id: `evaluation-feedback-field-of-${item.id}`
									}}
									multiline
									rows="2"
								/>
							</div>
						</div>
					) : null}
				</TableCell>
				<TableCell align="center">
					<span className="bold">{item.score}</span>
				</TableCell>
				<TableCell align="center">
					{item.type !== 'descriptive' ? (
						<TextField
							className={classes.scoreInput}
							inputProps={{ readOnly: true }}
							value={isRightlyAnswered ? item.score : 0}
							variant="outlined"
						/>
					) : null}
					{item.type === 'descriptive' ? (
						<TextField
							className={classes.scoreInput}
							inputProps={{ type: 'number', min: 0, id: `score-field-of-${item.id}` }}
							variant="outlined"
						/>
					) : null}
				</TableCell>
			</TableRow>
		</>
	);
};

export default Content;
