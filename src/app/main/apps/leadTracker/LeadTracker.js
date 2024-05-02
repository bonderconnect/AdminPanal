import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import Main from './LeadTrackerContent';
import reducer from '../subscriptions/store';
import Header from './header';
import Title from './titleBar';
import Dialogs from './leadTrackerDialog';

// function Header() {
// 	return <div>Header</div>;
// }

// function ContentToolbar() {
// 	return <div>contentToolbar</div>;
// }

// function Content() {
// 	return <div>content</div>;
// }

// function LeftSidebarHeader() {
// 	return <div>leftSidebarHeader</div>;
// }

// function LeftSidebarContent() {
// 	return <div>leftSidebarContent</div>;
// }

function LeadTracker(props) {
	const pageLayout = useRef(null);

	return (
		<>
			<FusePageCarded
				classes={{
					root: 'w-full',
					content: 'flex flex-col',
					header: 'items-center min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<Header />}
				contentToolbar={<Title />}
				content={<Main />}
				// leftSidebarHeader={<LeftSidebarHeader />}
				// leftSidebarContent={<LeftSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>
			<Dialogs />
		</>
	);
}

export default withReducer('LeadTracker', reducer)(LeadTracker);
// export default TodoTaskApp;
