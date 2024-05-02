import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from './store';
import PackagesHeader from './PackagesHeader';
import PackagesContent from './PackagesContent';
import PackagesToolbar from './PackagesToolbar';
import PackageDialogue from './PackageDialogue';
import { getPackages, setParams } from './store/packagesSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function PackagesApp(props) {
	const dispatch = useDispatch();
	const { count, params } = useSelector(({ packagesApp }) => packagesApp.packages);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		dispatch(getPackages(params));
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
				header={<PackagesHeader pageLayout={pageLayout} />}
				content={<PackagesContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<PackagesRightSidebarHeader />}
				// rightSidebarContent={<PackagesRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={
					<PackagesToolbar
						limit={params.limit}
						page={params.page}
						count={count}
						onChangePage={onChangePage}
						onChangeRowsPerPage={onChangeRowsPerPage}
					/>
				}
				ref={pageLayout}
				// innerScroll
				// sidebarInner
			/>
			<PackageDialogue />
		</>
	);
}

export default withReducer('packagesApp', reducer)(PackagesApp);
