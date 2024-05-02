import React, { useEffect, useRef } from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import FullscreenLoader from 'app/fuse-layouts/shared-components/FullscreenLoader';
import reducer from '../store';
import { clearQuestions, getExam, openNewExamQuestionDialog } from '../store/examQuestionsSlice';
import ExamHeader from './ExamHeader';
import ExamSidebarContent from './ExamSidebarContent';
import ExamQuestionsList from './ExamQuestionsList';
import ExamQuestionDialogue from './ExamQuestionDialogue';
import ExamQuestionOptionsDialogue from './ExamQuestionOptionsDialogue';

const isCRUDisabled = process.env.REACT_APP_DISABLE_EXAM_EDIT;

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function Exam(props) {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);
	const routeParams = useParams();

	const classes = useStyles(props);

	const { learningMaterialId } = routeParams;

	const { loading, learningMaterial } = useSelector(({ examApp }) => examApp.examQuestions);

	useDeepCompareEffect(() => {
		dispatch(
			getExam({
				learningMaterialId
			})
		);
	}, [dispatch, learningMaterialId]);

	useEffect(
		() => () => {
			dispatch(clearQuestions());
		},
		[]
	);

	const learningMaterialLoaded = !loading && learningMaterial;

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={learningMaterialLoaded && <ExamHeader pageLayout={pageLayout} />}
				content={!learningMaterialLoaded ? <FullscreenLoader /> : <ExamQuestionsList />}
				leftSidebarContent={learningMaterialLoaded && <ExamSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
			{!isCRUDisabled ? (
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Fab
						color="primary"
						aria-label="add"
						className={classes.addButton}
						onClick={ev => dispatch(openNewExamQuestionDialog())}
					>
						<Icon>add</Icon>
					</Fab>
				</FuseAnimate>
			) : null}
			<ExamQuestionDialogue />
			<ExamQuestionOptionsDialogue />
		</>
	);
}

export default withReducer('examApp', reducer)(Exam);
