import React, { useEffect } from 'react';
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-comment-textnodes */
import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { useDispatch, useSelector } from 'react-redux';
import helper from '../../../utils/helpers';
import {
	getCategoriesConstructionMaterials,
	openEditCategoriesConstructionMaterialsDialog,
	deleteCategoriesConstructionMaterials
} from './store/CategoriesConstructionMaterialsSlice';

const useStyles = makeStyles({
	typeIcon: {
		'&.folder:before': {
			content: "'folder'",
			color: '#FFB300'
		},
		'&.document:before': {
			content: "'insert_drive_file'",
			color: '#1565C0'
		},
		'&.spreadsheet:before': {
			content: "'insert_chart'",
			color: '#4CAF50'
		}
	}
});

function CategoriesConstructionMaterialsContent(props) {
	const dispatch = useDispatch();
	const status = useSelector(
		state => state.categoriesConstructionMaterialsApp.categoriesConstructionMaterials.status
	);
	const categories = useSelector(
		state => state.categoriesConstructionMaterialsApp.categoriesConstructionMaterials.categories
	);
	const categoriesConstructionMaterialsDialogue = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.categoriesConstructionMaterialsDialogue
	);
	// const services = categories[0]?.data?.products;
	const services = categories[0]?.data[0]?.categories;

	const servicesWithImageURL = services?.map(category => ({
		...category,
		image: helper.getImageUrlByFileKey(category?.image_file_key)
	}));
	const uniqueCategories = new Set();
	const uniqueConstructionMaterialss = servicesWithImageURL?.filter(item => {
		if (!uniqueCategories.has(item?.category_id)) {
			// If the category_id is not in the Set, add it and keep the item
			uniqueCategories.add(item?.category_id);
			return true;
		}
		return false;
	});

	useEffect(() => {
		if (status === 'idle') {
			dispatch(getCategoriesConstructionMaterials(['construction_materials']));
		}
	}, [dispatch, status]);

	const classes = useStyles();

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<div className="flex px-16">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="hidden sm:table-cell">Product ID</TableCell>
							<TableCell className="hidden sm:table-cell">Image</TableCell>
							<TableCell className="hidden sm:table-cell">Title</TableCell>
							<TableCell className="hidden sm:table-cell">Description</TableCell>
							<TableCell className="hidden sm:table-cell text-center">Status</TableCell>
							<TableCell className="hidden sm:table-cell">Delete</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{servicesWithImageURL?.map(item => {
							return (
								<TableRow
									key={item.product_id}
									hover
									onClick={() => dispatch(openEditCategoriesConstructionMaterialsDialog(item))}
									// selected={item.category_id === selectedItemId}
									className="cursor-pointer"
								>
									<TableCell className="hidden sm:table-cell">{item.product_id || '-NA-'}</TableCell>
									<TableCell className="hidden sm:table-cell">
										<img
											src={item?.image}
											alt={item.title}
											style={{
												width: '50px',
												height: '50px',
												transition: 'transform .2s',
												transform: 'scale(1)'
											}}
											onMouseOver={e => (e.currentTarget.style.transform = 'scale(5)')}
											onMouseOut={e => (e.currentTarget.style.transform = '')}
										/>
									</TableCell>
									<TableCell className="hidden sm:table-cell">{item.name || '-NA-'}</TableCell>
									<TableCell className="hidden sm:table-cell">{item.description || '-NA-'}</TableCell>
									<TableCell className="hidden sm:table-cell text-center">{item.status}</TableCell>

									<TableCell>
										<IconButton
											onClick={ev => {
												ev.stopPropagation();
												dispatch(
													openDialog({
														children: (
															<>
																<DialogTitle id="alert-dialog-title">
																	Are you sure want to delete this
																	ConstructionMaterials categories?
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action irreversible. But you'll able to
																		retrieve the ConstructionMaterials category's
																		data within 30 days by contacting support team.
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button
																		onClick={() => dispatch(closeDialog())}
																		color="primary"
																	>
																		Cancel
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(
																				deleteCategoriesConstructionMaterials(
																					item.product_id
																				)
																			);
																			dispatch(closeDialog());
																		}}
																		color="secondary"
																		autoFocus
																	>
																		Continue
																	</Button>
																</DialogActions>
															</>
														)
													})
												);
											}}
											aria-label="open right sidebar"
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</FuseAnimate>
	);
}

export default CategoriesConstructionMaterialsContent;
