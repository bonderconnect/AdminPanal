import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from './store';
import SubscriptionsHeader from './SubscriptionsHeader';
import SubscriptionsContent from './SubscriptionsContent';
import SubscriptionsToolbar from './SubscriptionsToolbar';
import SubscriptionDialogue from './subscriptionDialogue';
import { getSubscriptions, setParams } from './store/subscriptionsSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function SubscriptionsApp(props) {
	const dispatch = useDispatch();
	const { count, params } = useSelector(({ subscriptionsApp }) => subscriptionsApp.subscriptions);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		dispatch(getSubscriptions(params));
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
				header={<SubscriptionsHeader pageLayout={pageLayout} />}
				content={<SubscriptionsContent />}
				leftSidebarHeader={null}
				leftSidebarContent={null}
				rightSidebarHeader={null}
				rightSidebarContent={null}
				// rightSidebarHeader={<SubscriptionsRightSidebarHeader />}
				// rightSidebarContent={<SubscriptionsRightSidebarContent pageLayout={pageLayout} />}
				contentToolbar={
					<SubscriptionsToolbar
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
			<SubscriptionDialogue />
		</>
	);
}

export default withReducer('subscriptionsApp', reducer)(SubscriptionsApp);
