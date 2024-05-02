import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
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
import { selectCategories, openEditCategoryDialogue, deleteCategory } from './store/categoriesSlice';

const useStyles = makeStyles({});

const CategoryRow = ({ categoriesByParentId, item, dispatch, level }) => {
	return (
		<>
			<TableRow
				key={item.id}
				onClick={() => dispatch(openEditCategoryDialogue(item))}
				hover
				className="cursor-pointer"
			>
				<TableCell className="max-w-64 w-64 p-0 text-center py-2" />
				<TableCell className="pl-0 py-2">
					<>
						<span className="mr-16">
							{Array(level * 8)
								.fill('-')
								.join('')}
						</span>
						{item.title}
					</>
				</TableCell>
				<TableCell className="hidden sm:table-cell py-2">{item.type_text}</TableCell>
				<TableCell className="hidden sm:table-cell py-2">
					{item.description && helpers.trimCkeditorValue(item.description)}
				</TableCell>
				<TableCell className="hidden sm:table-cell py-2">
					{item.status_value === 1 ? 'Active' : 'Inactive'}
				</TableCell>
				<TableCell className="hidden sm:table-cell py-2">{item.serving_priority}</TableCell>
				<TableCell className="py-2">
					<IconButton
						onClick={ev => {
							ev.stopPropagation();
							dispatch(
								openDialog({
									children: (
										<>
											<DialogTitle id="alert-dialog-title">
												Are you sure want to delete this package?
											</DialogTitle>
											<DialogContent>
												<DialogContentText id="alert-dialog-description">
													This action irreversible. But you'll able to retreive the package's
													data within 30 days by contacting support team.
												</DialogContentText>
											</DialogContent>
											<DialogActions>
												<Button onClick={() => dispatch(closeDialog())} color="primary">
													Cancel
												</Button>
												<Button
													onClick={() => {
														dispatch(deleteCategory(item.category_id));
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
			{categoriesByParentId[item.category_id] &&
				categoriesByParentId[item.category_id].map(item_ => {
					return (
						<CategoryRow
							key={item_.category_id}
							categoriesByParentId={categoriesByParentId}
							dispatch={dispatch}
							item={item_}
							level={level + 1}
						/>
					);
				})}
		</>
	);
};

function CategoriesContent(props) {
	const dispatch = useDispatch();
	const categories = useSelector(selectCategories);

	const categoriesByParentId = useMemo(() => {
		const categoriesByParent = {};

		categories.forEach(categoryItem => {
			const parentId = categoryItem.parent_id || 0;
			if (categoriesByParent[parentId]) {
				categoriesByParent[parentId].push(categoryItem);
			} else {
				categoriesByParent[parentId] = [categoryItem];
			}
		});

		return categoriesByParent;
	}, [categories]);

	const classes = useStyles();

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<div className="flex px-16">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="max-w-64 w-64 p-0 text-center" />
							<TableCell className="w-4/12">Title</TableCell>
							<TableCell className="hidden sm:table-cell">Type</TableCell>
							<TableCell className="hidden sm:table-cell">Description</TableCell>
							<TableCell className="hidden sm:table-cell">Status</TableCell>
							<TableCell className="hidden sm:table-cell text-center">
								<Tooltip
									title="Subscriptions will show in according to serving priority, highest number will show first"
									placement="top"
								>
									<div className="flex items-center justify-center">
										<span>Serving priority</span>{' '}
										<Icon className="ml-4" color="action">
											low_priority
										</Icon>
									</div>
								</Tooltip>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>

					<TableBody>
						{categoriesByParentId[0] &&
							categoriesByParentId[0].map(item_ => {
								return (
									<CategoryRow
										key={item_.category_id}
										categoriesByParentId={categoriesByParentId}
										dispatch={dispatch}
										item={item_}
										level={0}
									/>
								);
							})}
					</TableBody>
				</Table>
			</div>
		</FuseAnimate>
	);
}

export default CategoriesContent;
