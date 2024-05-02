import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NoteAppHeader from './NoteAppHeader';
import NoteAppSidebarContent from './NoteAppSidebarContent';
import NoteAppSidebarHeader from './NoteAppSidebarHeader';
import NoteList from './notes/NoteList';
import NotesToolbar from './notes/NotesToolbar';
import NoteDialogue from './noteDialogue';
import reducer from './store';
import { getCategories } from './store/categorySlice';
import { getPackages } from './store/packageSlice';

function NoteApp(props) {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);
	const routeParams = useParams();

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
				header={<NoteAppHeader pageLayout={pageLayout} />}
				contentToolbar={<NotesToolbar />}
				content={<NoteList />}
				leftSidebarHeader={<NoteAppSidebarHeader />}
				leftSidebarContent={<NoteAppSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>
			<NoteDialogue />
		</>
	);
}

export default withReducer('noteApp', reducer)(NoteApp);
