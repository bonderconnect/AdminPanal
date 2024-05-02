import React, { useEffect, useRef } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';

import { useDispatch, useSelector } from 'react-redux';
import CategoriesMachineryContent from './CategoriesMachineryContent';
import CategoriesMachineryHeader from './CategoriesMachineryHeader';
import CategoriesMachineryToolbar from './CategoriesMachineryToolbar';
import MachineryDialogue from './categoriesMachineryDialogue';
import reducer from './store';
import { getCategoriesMachinery, setParams } from './store/CategoriesMachinerySlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function CategoriesMachineryApp(props) {
	const dispatch = useDispatch();

	const {
		// count,
		params
	} = useSelector(({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		dispatch(getCategoriesMachinery(params));
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
				header={<CategoriesMachineryHeader pageLayout={pageLayout} />}
				content={<CategoriesMachineryContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<CategoriesMachineryRightSidebarHeader />}
				// rightSidebarContent={<CategoriesMachineryRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={
					<CategoriesMachineryToolbar
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
			<MachineryDialogue />
		</>
	);
}

export default withReducer('categoriesMachineryApp', reducer)(CategoriesMachineryApp);
