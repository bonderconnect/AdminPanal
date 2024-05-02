import React from 'react';
import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { useDispatch } from 'react-redux';
import { openNewCategoryDialogue } from './store/categoriesSlice';

function CategoriesHeader(props) {
	const dispatch = useDispatch();

	return (
		<div className="flex flex-col flex-1 p-8 sm:p-12 relative">
			<div className="flex flex-1 p-8 sm:p-24">
				<FuseAnimate animation="transition.expandIn" delay={600}>
					<Button
						variant="contained"
						color="secondary"
						aria-label="add"
						className="absolute bottom-0 ltr:left-0 rtl:right-0 mx-16 -mb-20 z-999"
						onClick={() => dispatch(openNewCategoryDialogue())}
						endIcon={<Icon>add</Icon>}
					>
						New Category
					</Button>
				</FuseAnimate>
				<FuseAnimate delay={200}>
					<div className="flex items-center">
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Icon className="text-32">category</Icon>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography variant="h6" className="mx-12 hidden sm:flex">
								Categories
							</Typography>
						</FuseAnimate>
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default CategoriesHeader;
