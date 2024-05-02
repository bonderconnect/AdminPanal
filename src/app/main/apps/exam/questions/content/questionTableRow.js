import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FuseUtils from '@fuse/utils/FuseUtils';

import update from 'immutability-helper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {},
	optionsTextCell: {
		minWidth: '100px'
	},
	optionsCellWrapper: {},
	questionNoOptionstext: {
		marginBottom: '12px',
		color: '#6f6f6f',
		fontStyle: 'italic'
	},
	qnTypeSelect: {
		width: 200
	}
}));

const QuestionTableRow = props => {
	const classes = useStyles();
	const { item, index: questionIndex, handleRemoveQuestion } = props;
	const [questionValue, setQuestionValue] = useState('');
	const [questionScore, setQuestionScore] = useState(1);
	const [questionOptions, setQuestionOptions] = useState([]);
	const [questionType, setQuestionType] = useState('mcq');

	useEffect(() => {
		if (item) {
			setQuestionValue(item.question);
			setQuestionScore(item.score);
			setQuestionType(item.type);

			if (item.type === 'mcq' && item.options) {
				setQuestionOptions(item.options);
			}
		}
	}, [item]);

	const handleAddQuestionOption = () => {
		const questionOptionsUpdated = update(questionOptions, {
			$push: [{ option_text: '', is_right_option: false, temp_id: FuseUtils.generateGUID() }]
		});

		setQuestionOptions(questionOptionsUpdated);
	};

	const handleOptionValueChange = (ev, optionItemIndex) => {
		const questionOptionsUpdated = update(questionOptions, {
			[optionItemIndex]: {
				option_text: {
					$set: ev.target.value
				}
			}
		});
		setQuestionOptions(questionOptionsUpdated);
	};

	const handleOptionIsRightChange = (ev, optionItemIndex) => {
		// Unchecking all
		let questionOptionsUpdated = update(questionOptions, arr =>
			arr.map(optionItem => ({ ...optionItem, is_right_option: false }))
		);

		questionOptionsUpdated = update(questionOptionsUpdated, {
			[optionItemIndex]: {
				is_right_option: {
					$set: ev.target.checked
				}
			}
		});

		setQuestionOptions(questionOptionsUpdated);
	};

	const handleOptionRemove = optionItemIndex => {
		const questionOptionsUpdated = update(questionOptions, { $splice: [[optionItemIndex, 1]] });
		setQuestionOptions(questionOptionsUpdated);
	};

	useEffect(() => {
		if (questionType === 'descriptive') {
			setQuestionOptions([]);
		}
	}, [questionType]);

	const qno = questionIndex + 1;
	return (
		<TableRow>
			<TableCell className="align-top">
				<span className="text-xl"># {qno}</span>
			</TableCell>
			<TableCell className="align-top">
				<TextField
					label={`Question: ${qno}`}
					inputProps={{
						'data-qn-index': questionIndex,
						id: `qn-textfield-withindex-${questionIndex}`,
						'data-id': item.id,
						'data-temp_id': item.temp_id
					}}
					className={clsx(classes.textField)}
					margin="dense"
					variant="outlined"
					rows="6"
					fullWidth
					multiline
					value={questionValue}
					onChange={ev => setQuestionValue(ev.target.value)}
				/>
			</TableCell>
			<TableCell className={clsx(classes.optionsTextCell)}>
				<div className={clsx('flex flex-col justify-start items-start')}>
					<div className="flex flex-col self-stretch">
						{questionOptions.length ? (
							questionOptions.map((questionOptionItem, questionOptionItemIndex) => {
								return (
									<div
										key={`_${questionOptionItem.id || questionOptionItem.temp_id}`}
										className="flex flex-col"
									>
										<div className="flex">
											<TextField
												label={`Option ${questionOptionItemIndex + 1} of  question ${qno}`}
												inputProps={{
													'data-qn-index': questionIndex,
													id: `option-of-qn-${questionIndex}-optionindex-${questionOptionItemIndex}`,
													'data-id': questionOptionItem.id,
													'data-temp_id': questionOptionItem.temp_id
												}}
												className={clsx(classes.textField)}
												margin="dense"
												variant="outlined"
												rows="2"
												fullWidth
												multiline
												value={questionOptionItem.option_text}
												onChange={ev => handleOptionValueChange(ev, questionOptionItemIndex)}
											/>
										</div>
										<div className="flex justify-end">
											<FormControlLabel
												control={
													<Checkbox
														checked={!!questionOptionItem.is_right_option}
														onChange={ev =>
															handleOptionIsRightChange(ev, questionOptionItemIndex)
														}
														inputProps={{
															'data-qn-index': questionIndex,
															id: `option-checked-of-qn-${questionIndex}-optionindex-${questionOptionItemIndex}`
														}}
													/>
												}
												label="Is right option"
											/>
											<Button
												onClick={() => handleOptionRemove(questionOptionItemIndex)}
												size="small"
												endIcon={<Icon>close</Icon>}
											>
												Remove
											</Button>
										</div>
									</div>
								);
							})
						) : (
							<span className={classes.questionNoOptionstext}>- No Options for this question yet -</span>
						)}
					</div>
					<div className={clsx('flex flex-col justify-center pt-6')}>
						<Button
							variant="outlined"
							size="small"
							color="primary"
							disabled={questionType === 'descriptive'}
							className={classes.margin}
							endIcon={<Icon>add</Icon>}
							onClick={handleAddQuestionOption}
						>
							Add Option
						</Button>
					</div>
				</div>
			</TableCell>
			<TableCell className="align-top">
				<div className="flex flex-col">
					<div className="flex justify-end">
						<TextField
							label="Score"
							inputProps={{
								'data-qn-index': questionIndex,
								id: `score-of-qn-${questionIndex}`
							}}
							className={clsx(classes.textField)}
							margin="dense"
							variant="outlined"
							value={questionScore}
							onChange={ev => setQuestionScore(ev.target.value)}
						/>
					</div>
					<div className="flex justify-end mt-8">
						<TextField
							select
							label="MCQ / Descriptive"
							margin="dense"
							value={questionType}
							onChange={ev => setQuestionType(ev.target.value)}
							variant="outlined"
							className={classes.qnTypeSelect}
							inputProps={{
								'data-qn-index': questionIndex,
								id: `type-of-qn-${questionIndex}`
							}}
						>
							{[
								{ label: 'MCQ', value: 'mcq' },
								{ label: 'Descriptive', value: 'descriptive' }
							].map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className="flex justify-end mt-8">
						<Button
							size="small"
							className={clsx(classes.addQtnBtn)}
							endIcon={<Icon>close</Icon>}
							onClick={() => setTimeout(() => handleRemoveQuestion(questionIndex), 0)}
							disableElevation
						>
							Delete Question
						</Button>
					</div>
				</div>
			</TableCell>
		</TableRow>
	);
};

export default QuestionTableRow;
