import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import helpers from 'app/utils/helpers';
import { selectCategoryTypes, openEditCategoryTypeDialogue, deleteCategoryType } from './store/categoryTypesSlice';

const useStyles = makeStyles({});

function CategoriesContent(props) {
	const dispatch = useDispatch();
	const categoryTypes = useSelector(selectCategoryTypes);

	const classes = useStyles();

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<div className="flex px-16">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="max-w-64 w-64 p-0 text-center" />
							<TableCell className="w-2/5">Title</TableCell>
							<TableCell className="hidden sm:table-cell">Description</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>

					<TableBody>
						{Object.values(categoryTypes).map(item => {
							return (
								<TableRow
									key={item.type_id}
									onClick={() => dispatch(openEditCategoryTypeDialogue(item))}
									hover
									className="cursor-pointer"
								>
									<TableCell className="max-w-64 w-64 p-0 text-center py-2" />
									<TableCell className="hidden sm:table-cell py-2">{item.text}</TableCell>
									<TableCell className="hidden sm:table-cell py-2">{item.description}</TableCell>
									<TableCell className="py-2">
										<IconButton
											onClick={ev => {
												ev.stopPropagation();
												dispatch(
													openDialog({
														children: (
															<>
																<DialogTitle id="alert-dialog-title">
																	Are you sure want to delete this type?
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action irreversible. But you'll able to
																		retreive the package's data within 30 days by
																		contacting support team.
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
																			dispatch(deleteCategoryType(item.type_id));
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

export default CategoriesContent;
