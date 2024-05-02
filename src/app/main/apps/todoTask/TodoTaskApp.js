import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React, { useRef, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import CenteredGrid from './TodoTaskAppContent';
import reducer from '../subscriptions/store';
import Filter from './filters';
import Labels from './labels';

const useStyles = makeStyles(theme => ({
	root1: {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconPadding: {
		margin: '12px 12px 16px 12px'
	}
}));
function Header() {
	return <div>Header</div>;
}

function ContentToolbar() {
	return <div>contentToolbar</div>;
}

function Content() {
	return <div>content</div>;
}

function LeftSidebarHeader() {
	const classes = useStyles();
	return (
		<div className={clsx(classes.root1)}>
			<div className={clsx(classes.iconPadding)}>
				<ListAltIcon />
			</div>
			<div>
				<Typography variant="h5" gutterBottom>
					To-Do
				</Typography>
			</div>
		</div>
	);
}

function LeftSidebarContent() {
	return <div>leftSidebarContent</div>;
}

function TodoTaskApp(props) {
	const pageLayout = useRef(null);

	return (
		<>
			<FusePageCarded
				classes={{
					root: 'w-full',
					content: 'flex flex-col',
					header: 'items-center min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={null}
				contentToolbar={<ContentToolbar />}
				content={<CenteredGrid />}
				leftSidebarHeader={<LeftSidebarHeader />}
				leftSidebarContent={
					<>
						<Filter />
						<Labels />
					</>
				}
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('TodoTaskApp', reducer)(TodoTaskApp);
// export default TodoTaskApp;
