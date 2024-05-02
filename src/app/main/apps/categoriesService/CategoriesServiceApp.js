import React, { useEffect, useRef } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';

import { useDispatch, useSelector } from 'react-redux';
import CategoriesServiceContent from './CategoriesServiceContent';
import CategoriesServiceHeader from './CategoriesServiceHeader';
import CategoriesServiceToolbar from './CategoriesServiceToolbar';
import ServiceDialogue from './categoriesServiceDialogue';
import reducer from './store';
import { getCategoriesService, setParams } from './store/CategoriesServiceSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function CategoriesServiceApp(props) {
	const dispatch = useDispatch();

	const {
		// count,
		params
	} = useSelector(({ categoriesServiceApp }) => categoriesServiceApp.categoriesService);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		dispatch(getCategoriesService(params));
	}, [dispatch, params]);
	const onChangePage = (_, nextPageIndex) => {
		dispatch(setParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onChangeRowsPerPage = rowsLimit => {
		dispatch(setParams({ ...params, page: 1, limit: rowsLimit.target.value }));
	};

	return (
		<>
			<FusePageSimple
				classes={{
					root: 'bg-red',
					header: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					sidebarHeader: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					rightSidebar: 'w-640'
				}}
				header={<CategoriesServiceHeader pageLayout={pageLayout} />}
				content={<CategoriesServiceContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<CategoriesServiceRightSidebarHeader />}
				// rightSidebarContent={<CategoriesServiceRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={
					<CategoriesServiceToolbar
						limit={params?.limit}
						page={params?.page}
						// count={count}
						onChangePage={onChangePage}
						onChangeRowsPerPage={onChangeRowsPerPage}
					/>
				}
				ref={pageLayout}
				// innerScroll
				// sidebarInner
			/>
			<ServiceDialogue />
		</>
	);
}

export default withReducer('categoriesServiceApp', reducer)(CategoriesServiceApp);
