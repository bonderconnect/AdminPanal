import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import AdsDialog from './AdsDialog';
// import UserSubscriptionDialog from './UserSubscriptionDialog';
import AdsHeader from './AdsHeader';
import AdsList from './AdsList';
// import UsersSidebarContent from './UsersSidebarContent';
import reducer from './store';
// import { openNewUserDialog, getUsers } from '../store/usersSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function Ads(props) {
	const dispatch = useDispatch();

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-72 sm:min-h-72',
					wrapper: 'min-h-0'
				}}
				header={<AdsHeader pageLayout={pageLayout} />}
				content={<AdsList />}
				// leftSidebarContent={<UsersSidebarContent />}
				ref={pageLayout}
			/>
			<AdsDialog />
			{/* <UserSubscriptionDialog /> */}
		</>
	);
}

export default withReducer('ads', reducer)(Ads);
