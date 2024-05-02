import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from './store';
import CategoriesHeader from './CategoriesHeader';
import CategoriesToolbar from './CategoriesToolbar';
import CategoriesContent from './CategoriesContent';
import CategoryTypesContent from './CategoryTypesContent';
import CategoryTypesHeader from './CategoryTypesHeader';
// import SubscriptionsHeader from './SubscriptionsHeader';
// import SubscriptionsContent from './SubscriptionsContent';
// import SubscriptionsToolbar from './SubscriptionsToolbar';
// import SubscriptionDialogue from './subscriptionDialogue';
import { getCategories } from './store/categoriesSlice';
import { getCategoryTypes } from './store/categoryTypesSlice';
import CategoryDialogue from './categoryDialogue/CategoriesDialogue';
import CategoryTypeDialogue from './CategoryTypeDialogue';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function CategoriesApp(props) {
	const dispatch = useDispatch();
	const [tabValue, setTabValue] = useState(0);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(getCategories());
		dispatch(getCategoryTypes());
	}, []);

	return (
		<>
			<FusePageSimple
				classes={{
					root: 'bg-red',
					header: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					sidebarHeader: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					rightSidebar: 'w-640'
				}}
				header={tabValue === 0 ? <CategoriesHeader /> : <CategoryTypesHeader />}
				content={tabValue === 0 ? <CategoriesContent /> : <CategoryTypesContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<SubscriptionsRightSidebarHeader />}
				// rightSidebarContent={<SubscriptionsRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={<CategoriesToolbar tabValue={tabValue} setTabValue={setTabValue} />}
				ref={pageLayout}
				// innerScroll
				// sidebarInner
			/>
			<CategoryDialogue />
			<CategoryTypeDialogue />
		</>
	);
}

export default withReducer('categoriesApp', reducer)(CategoriesApp);
