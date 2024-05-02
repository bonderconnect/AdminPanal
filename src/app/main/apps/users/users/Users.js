import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import UserDialog from './UserDialog';
import UserSubscriptionDialog from './UserSubscriptionDialog';
import UsersHeader from './UsersHeader';
import UsersList from './UsersList';
import UsersSidebarContent from './UsersSidebarContent';
import reducer from '../store';
import { openNewUserDialog, getUsers } from '../store/usersSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function UsersApp(props) {
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
				header={<UsersHeader pageLayout={pageLayout} />}
				content={<UsersList />}
				// leftSidebarContent={<UsersSidebarContent />}
				ref={pageLayout}
			/>
			<UserDialog />
			<UserSubscriptionDialog />
		</>
	);
}

export default withReducer('usersApp', reducer)(UsersApp);
