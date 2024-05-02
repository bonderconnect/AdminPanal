import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import update from 'immutability-helper';
import Table from '@material-ui/core/Table';
import Icon from '@material-ui/core/Icon';
import FuseUtils from '@fuse/utils/FuseUtils';
import TableFooter from '@material-ui/core/TableFooter';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { selectAllQuestions } from '../../store/questionsSlice';
import QuestionTableRow from './questionTableRow';
import BottomActions from './bottomActions';

const useStyles = makeStyles(theme => ({
	addQtnBtn: {}
}));

const Content = props => {
	const classes = useStyles();
	const { learningMaterialId } = props;
	const questionsFromStore = useSelector(selectAllQuestions);
	const [questionsLocalRef, setQuestionLocalRef] = useState([]);

	useEffect(() => {
		setQuestionLocalRef(questionsFromStore);
	}, [questionsFromStore]);

	const handleAddQuestion = () => {
		const updatedQuestionsLocalRef = update(questionsLocalRef, {
			$push: [{ temp_id: FuseUtils.generateGUID(), type: 'mcq' }]
		});
		setQuestionLocalRef(updatedQuestionsLocalRef);
	};

	const handleRemoveQuestion = targetIndex => {
		console.log('targetIndex:', targetIndex);
		console.log('questionsLocalRef:', questionsLocalRef);
		const updatedQuestionsLocalRef = update(questionsLocalRef, { $splice: [[targetIndex, 1]] });
		setQuestionLocalRef(updatedQuestionsLocalRef);
	};

	return (
		<div>
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
								<TableCell>
									<div className="flex flex-col">
										<div>
											<span className="text-xs"># S.No </span>/
										</div>
										<div>
											<span className="text-xs">Serving Priority</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="text-xl">Questions</TableCell>
								<TableCell className="text-lg">Options</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{questionsLocalRef.map((item, index) => {
								return (
									<QuestionTableRow
										key={`_${item.id || item.temp_id}`}
										item={item}
										index={index}
										handleRemoveQuestion={handleRemoveQuestion}
									/>
								);
							})}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan="4">
									<div className="flex flex-1">
										<Button
											variant="contained"
											size="small"
											color="primary"
											className={clsx(classes.addQtnBtn)}
											endIcon={<Icon>add</Icon>}
											onClick={() => setTimeout(() => handleAddQuestion(), 0)}
										>
											Add Question
										</Button>
									</div>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
				<BottomActions learningMaterialId={learningMaterialId} />
			</div>
		</div>
	);
};

export default Content;
