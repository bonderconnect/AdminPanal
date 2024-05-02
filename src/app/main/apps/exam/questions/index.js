import React, { useEffect } from 'react';
import FullscreenLoader from 'app/fuse-layouts/shared-components/FullscreenLoader';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getExam } from '../store/exam/detail';
import reducer from '../store';
// import { getChoosedOptions, getExam, getQuestionAnswers, getQuestions, getUserAttempt } from '../store/questionsSlice';
import Toolbar from './toolbar';
import Header from './header';
import Content from './content';
import { getQuestionsWithAnswers } from '../store/questionsSlice';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: '#fafafa'
	},
	topBg: {
		backgroundSize: 'cover !important',
		backgroundPosition: 'center center !important'
	},
	layoutHeader: {
		background: 'none',
		height: 'auto !important'
	}
}));

function Questions() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const params = useParams();
	const questionsLoading = useSelector(state => state.examApp.questions.loading);
	const examLoading = useSelector(state => state.examApp.exam.detail.loading);
	const exam = useSelector(state => state.examApp.exam.detail.data);
	const { learningMaterialId } = params;

	const loading = questionsLoading || examLoading || !exam;

	useEffect(() => {
		dispatch(getExam(learningMaterialId));
		dispatch(getQuestionsWithAnswers(learningMaterialId));
	}, [learningMaterialId]);

	return (
		<>
			{loading ? (
				<FullscreenLoader />
			) : (
				<FusePageSimple
					classes={{
						root: classes.root,
						topBg: classes.topBg,
						header: classes.layoutHeader,
						wrapper: 'bg-transparent',
						content: 'w-full px-24',
						toolbar: 'w-full mx-auto relative flex flex-col min-h-auto h-auto items-start'
					}}
					header={<Header />}
					contentToolbar={<Toolbar exam={exam} />}
					content={<Content learningMaterialId={learningMaterialId} />}
				/>
			)}
		</>
	);
}

export default withReducer('examApp', reducer)(Questions);
