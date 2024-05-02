import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { openNewCategoriesServiceDialog } from './store/CategoriesServiceSlice';

function CategoriesServiceHeader(props) {
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
						onClick={() => dispatch(openNewCategoriesServiceDialog())}
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
								Categories Service
							</Typography>
						</FuseAnimate>
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default CategoriesServiceHeader;
