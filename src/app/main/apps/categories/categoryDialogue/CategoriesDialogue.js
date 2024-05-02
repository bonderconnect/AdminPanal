import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TextFieldFormsy, SelectFormsy, CkeditorFormsy } from '@fuse/core/formsy';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeEditCategoryDialogue,
	closeNewCategoryDialogue,
	selectCategories,
	addCategory,
	updateCategory
} from '../store/categoriesSlice';
import { selectCategoryTypes } from '../store/categoryTypesSlice';
import ParentCategorySelectFormsy from './ParentCategorySelectFormsy';

const defaultFormState = {
	category_id: '',
	title: '',
	description: '',
	image_url: '',
	parent_id: '',
	type_value: '',
	serving_priority: '',
	status_value: ''
};

const useStyles = makeStyles(theme => ({
	servingPriorityHelper: {
		fontSize: 12,
		fontStyle: 'italic'
	}
}));

const statusSelectOptions = [
	{ value: 1, label: 'Published / Active' },
	{ value: 0, label: 'Unpublished / Inactive' }
];

function CategoryDialogue(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const categoryDialogue = useSelector(({ categoriesApp }) => categoriesApp.categories.categoryDialogue);
	const categories = useSelector(selectCategories);
	const categoryTypes = useSelector(selectCategoryTypes);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);
	const previousParentIdRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (categoryDialogue.type === 'edit' && categoryDialogue.data) {
			setForm({ ...categoryDialogue.data, previous_parent_id: categoryDialogue.data.parent_id });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (categoryDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...categoryDialogue.data,
				category_id: FuseUtils.generateGUID()
			});
		}
	}, [categoryDialogue.data, categoryDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (categoryDialogue.props.open) {
			initDialog();
		}
	}, [categoryDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return categoryDialogue.type === 'edit'
			? dispatch(closeEditCategoryDialogue())
			: dispatch(closeNewCategoryDialogue());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	const handleChangeMiddleware = ev => {
		handleChange(ev);
		const { target } = ev;
	};

	function handleSubmit() {
		if (categoryDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addCategoryPayload = { ...form };
			delete addCategoryPayload.category_id;
			delete addCategoryPayload[''];
			dispatch(addCategory({ category: addCategoryPayload, closeNewCategoryDialog: true }));
		} else {
			const updateCategoryPayload = { ...form };
			delete updateCategoryPayload.category_id;
			delete updateCategoryPayload[''];
			delete updateCategoryPayload.type_text;
			delete updateCategoryPayload.type_value;
			delete updateCategoryPayload.parent_id;
			delete updateCategoryPayload.previous_parent_id;
			dispatch(updateCategory({ category: updateCategoryPayload, categoryId: form.category_id }));
			closeComposeDialog();
		}
	}

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

	useEffect(() => {
		if (form.category_id && form.parent_id && categoriesByParentId[form.parent_id]) {
			const { type_value: typeValue } = categoriesByParentId[form.parent_id][0];
			setForm({ ...form, type_value: typeValue });
		} else if (
			previousParentIdRef.current &&
			((form.category_id && form.parent_id === null) ||
				(form.category_id && !categoriesByParentId[form.parent_id]))
		) {
			setForm({ ...form, type_value: '' });
		}
		previousParentIdRef.current = form.parent_id; // Will auto populate in this first form assign
	}, [form.parent_id]);

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...categoryDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{categoryDialogue.type === 'new' ? 'New Category' : 'Edit Category'}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className="flex flex-col md:overflow-hidden"
			>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">text_fields</Icon>
						</div>
						<TextFieldFormsy
							className="mb-24"
							type="text"
							name="title"
							label="Title"
							value={form.title}
							validations={{
								minLength: 4
							}}
							validationErrors={{
								minLength: 'Min character length is 6'
							}}
							variant="outlined"
							onChange={handleChangeMiddleware}
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-48">
							<Icon color="action">description</Icon>
						</div>

						<CkeditorFormsy
							value={form.description}
							name="description"
							label="Description *"
							validations={{
								minLength: 6
							}}
							validationErrors={{
								minLength: 'Min character length is 6',
								required: 'Description is required'
							}}
							onChange={handleChangeMiddleware}
							required
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">image</Icon>
						</div>
						<TextFieldFormsy
							className="mb-24"
							type="text"
							name="image_url"
							label="Icon Image Url"
							value={form.image_url}
							variant="outlined"
							onChange={handleChangeMiddleware}
							fullWidth
						/>
					</div>

					{categoryDialogue.type === 'new' && (
						<div className="flex my-20">
							<ParentCategorySelectFormsy
								defaultCategoryId={form.previous_parent_id}
								name="parent_id"
								label="Parent Category"
								value={form.parent_id}
								variant="outlined"
								autoWidth
								categories={categories}
								onChange={handleChangeMiddleware}
							/>
						</div>
					)}
					{categoryDialogue.type === 'new' && (
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">details</Icon>
							</div>

							<SelectFormsy
								className="mb-16 flex-1"
								name="type_value"
								label="Category Type"
								value={form.type_value}
								variant="outlined"
								autoWidth
								required
								onChange={handleChangeMiddleware}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{categoryTypes &&
									Object.values(categoryTypes).map(item => (
										<MenuItem key={`-${item.type_id}`} value={item.value}>
											{item.text}
										</MenuItem>
									))}
							</SelectFormsy>
						</div>
					)}

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">low_priority</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="serving_priority"
								label="Serving Priority"
								value={form.serving_priority}
								validations={{
									isNumeric: true
								}}
								validationErrors={{
									isNumeric: 'Must be a valid number'
								}}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className={classes.servingPriorityHelper} variant="body2" gutterBottom>
								The highest number have higher priority in serving order
							</Typography>
						</div>
					</div>

					<div className="flex mt-8 z-0">
						<div className="min-w-48 pt-20">
							<Icon color="action">perm_identity</Icon>
						</div>

						<SelectFormsy
							className="mb-16 flex-1"
							name="status_value"
							label="Status"
							value={form.status_value}
							variant="outlined"
							autoWidth
							required
							onChange={handleChangeMiddleware}
						>
							{statusSelectOptions.map(item => (
								<MenuItem key={`-${item.value}`} value={item.value}>
									{item.label}
								</MenuItem>
							))}
						</SelectFormsy>
					</div>
				</DialogContent>
				{categoryDialogue.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{categoryDialogue.submitting ? (
								<Button disableElevation variant="contained" color="primary" type="button" disabled>
									Please wait ... <CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={handleChangeMiddleware}
									type="submit"
									disabled={!isFormValid}
								>
									Add
								</Button>
							)}
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleChangeMiddleware}
								disabled={!isFormValid}
							>
								Save
							</Button>
						</div>
					</DialogActions>
				)}
			</Formsy>
		</Dialog>
	);
}

export default CategoryDialogue;
