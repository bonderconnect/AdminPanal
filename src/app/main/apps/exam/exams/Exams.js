import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import reducer from '../store';
import ExamsHeader from './ExamsHeader';
import ExamsList from './ExamsList';
import { getCategories } from '../store/categorySlice';
import { getPackages } from '../store/packageSlice';
import ExamsSidebarContent from './ExamsSidebarContent';
import ExamsSidebarHeader from './ExamsSidebarHeader';
import ExamsToolbar from './ExamsToolbar';
import ExamDialog from '../examDialogue';

function Exams(props) {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(getCategories());
		dispatch(getPackages());
	}, [dispatch]);

	return (
		<>
			<FusePageCarded
				classes={{
					root: 'w-full',
					content: 'flex flex-col',
					header: 'items-center min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<ExamsHeader pageLayout={pageLayout} />}
				contentToolbar={<ExamsToolbar />}
				content={<ExamsList />}
				leftSidebarHeader={<ExamsSidebarHeader />}
				leftSidebarContent={<ExamsSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>
			<ExamDialog />
		</>
	);
}

export default withReducer('examApp', reducer)(Exams);
