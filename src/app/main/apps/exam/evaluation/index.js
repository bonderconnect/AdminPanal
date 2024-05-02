import React, { useEffect } from 'react';
import FullscreenLoader from 'app/fuse-layouts/shared-components/FullscreenLoader';
import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import reducer from '../store';
import { getChoosedOptions, getExam, getQuestionAnswers, getQuestions, getUserAttempt } from '../store/evaluationSlice';
import Toolbar from './toolbar';
import Header from './header';
import Content from './content';

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

function Evaluation() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const params = useParams();
	const { loading, exam } = useSelector(state => state.examApp.evaluation);
	const { learningMaterialId, attemptId } = params;

	useEffect(() => {
		if (learningMaterialId) {
			dispatch(getExam(learningMaterialId));
			dispatch(getQuestions(learningMaterialId));
			dispatch(getQuestionAnswers(learningMaterialId));
		}
	}, [learningMaterialId]);

	useEffect(() => {
		if (attemptId && learningMaterialId) {
			dispatch(getUserAttempt({ learningMaterialId, attemptId }));
			dispatch(getChoosedOptions({ learningMaterialId, attemptId }));
		}
	}, [learningMaterialId, attemptId]);

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
					header={<Header learningMaterialId={learningMaterialId} />}
					contentToolbar={<Toolbar exam={exam} />}
					content={<Content />}
				/>
			)}
		</>
	);
}

export default withReducer('examApp', reducer)(Evaluation);
