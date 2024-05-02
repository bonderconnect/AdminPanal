import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import ProductsHeader from './ProductsHeader';
import ProductsContent from './ProductsContent';
import reducer from '../store';
import ProductDialog from '../ProductDialog';

const useStyles = makeStyles({
	addButtonFab: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	addButtonFabInner: {
		position: 'relative'
	},
	fabAddPostfix: {
		position: 'absolute',
		top: 16,
		left: 12
	}
});

function ProductsApp(props) {
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
				header={<ProductsHeader />}
				content={<ProductsContent />}
				leftSidebarContent={null}
				ref={pageLayout}
			/>
			<ProductDialog />
		</>
	);
}

export default withReducer('productsApp', reducer)(ProductsApp);
