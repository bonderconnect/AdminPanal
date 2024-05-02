import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { useDispatch } from 'react-redux';
import { openNewSubscriptionDialog } from './store/subscriptionsSlice';

function SubscriptionsHeader(props) {
	const { pageLayout } = props;
	const dispatch = useDispatch();

	return (
		<div className="flex flex-col flex-1 p-8 sm:p-12 relative">
			<div className="flex flex-1 p-8 sm:p-24">
				<FuseAnimate animation="transition.expandIn" delay={600}>
					<Fab
						color="secondary"
						aria-label="add"
						className="absolute bottom-0 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999"
						onClick={() => dispatch(openNewSubscriptionDialog())}
					>
						<Icon>add</Icon>
					</Fab>
				</FuseAnimate>
				<FuseAnimate delay={200}>
					<div className="flex items-center">
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Icon className="text-32">attach_money</Icon>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography variant="h6" className="mx-12 hidden sm:flex">
								Subscriptions
							</Typography>
						</FuseAnimate>
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default SubscriptionsHeader;
