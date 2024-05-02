import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import VideoAppHeader from './VideoAppHeader';
import VideoAppSidebarContent from './VideoAppSidebarContent';
import VideoAppSidebarHeader from './VideoAppSidebarHeader';
import VideoList from './videos/VideoList';
import VideosToolbar from './videos/VideosToolbar';
import VideoDialogue from './videoDialogue';
import VideoPreviewDialogue from './videoPreviewDialogue';
import reducer from './store';
import { getCategories } from './store/categorySlice';
import { getPackages } from './store/packageSlice';

function VideoApp(props) {
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
				header={<VideoAppHeader pageLayout={pageLayout} />}
				contentToolbar={<VideosToolbar />}
				content={<VideoList />}
				leftSidebarHeader={<VideoAppSidebarHeader />}
				leftSidebarContent={<VideoAppSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>
			<VideoDialogue />
			<VideoPreviewDialogue />
		</>
	);
}

export default withReducer('videoApp', reducer)(VideoApp);
