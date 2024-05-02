import React, { useEffect, useRef } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';

import { useDispatch, useSelector } from 'react-redux';
import CategoriesConstructionMaterialsContent from './CategoriesConstructionMaterialsContent';
import CategoriesConstructionMaterialsHeader from './CategoriesConstructionMaterialsHeader';
import CategoriesConstructionMaterialsToolbar from './CategoriesConstructionMaterialsToolbar';
import ConstructionMaterialsDialogue from './categoriesConstructionMaterialsDialogue';
import reducer from './store';
import { getCategoriesConstructionMaterials, setParams } from './store/CategoriesConstructionMaterialsSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function CategoriesConstructionMaterialsApp(props) {
	const dispatch = useDispatch();

	const {
		// count,
		params
	} = useSelector(
		({ categoriesConstructionMaterialsApp }) => categoriesConstructionMaterialsApp.categoriesConstructionMaterials
	);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		dispatch(getCategoriesConstructionMaterials(params));
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
				header={<CategoriesConstructionMaterialsHeader pageLayout={pageLayout} />}
				content={<CategoriesConstructionMaterialsContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<CategoriesConstructionMaterialsRightSidebarHeader />}
				// rightSidebarContent={<CategoriesConstructionMaterialsRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={
					<CategoriesConstructionMaterialsToolbar
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
			<ConstructionMaterialsDialogue />
		</>
	);
}

export default withReducer('categoriesConstructionMaterialsApp', reducer)(CategoriesConstructionMaterialsApp);
