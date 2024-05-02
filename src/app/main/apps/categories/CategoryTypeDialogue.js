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
import { TextFieldFormsy } from '@fuse/core/formsy';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeNewCategoryTypeDialogue,
	closeEditCategoryTypeDialogue,
	addCategoryType,
	updateCategoryType
} from './store/categoryTypesSlice';

const defaultFormState = {
	type_id: '',
	text: ''
};

function CategoryTypeDialogue(props) {
	const dispatch = useDispatch();
	const categoryTypeDialogue = useSelector(({ categoriesApp }) => categoriesApp.categoryTypes.categoryTypeDialogue);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (categoryTypeDialogue.type === 'edit' && categoryTypeDialogue.data) {
			setForm({ ...categoryTypeDialogue.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (categoryTypeDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...categoryTypeDialogue.data
			});
		}
	}, [categoryTypeDialogue.data, categoryTypeDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (categoryTypeDialogue.props.open) {
			initDialog();
		}
	}, [categoryTypeDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return categoryTypeDialogue.type === 'edit'
			? dispatch(closeEditCategoryTypeDialogue())
			: dispatch(closeNewCategoryTypeDialogue());
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
		if (categoryTypeDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addCategoryTypePayload = { ...form };
			delete addCategoryTypePayload.type_id;
			dispatch(addCategoryType({ addCategoryTypePayload, closeNewCategoryTypeDialog: true }));
		} else {
			const updateCategoryTypePayload = { text: form.text, description: form.description };
			dispatch(
				updateCategoryType({
					updateCategoryTypePayload,
					categoryTypeId: form.type_id
				})
			);
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...categoryTypeDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{categoryTypeDialogue.type === 'new' ? 'New Category Type' : 'Edit Category Type'}
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
							name="text"
							label="Name"
							value={form.text}
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

						<TextFieldFormsy
							className="mb-24"
							type="text"
							name="description"
							label="Description"
							multiline
							rows={4}
							value={form.description}
							validations={{
								maxLength: 320
							}}
							validationErrors={{
								maxLength: 'Exceeds maximum character limit 320'
							}}
							variant="outlined"
							onChange={handleChangeMiddleware}
							fullWidth
						/>
					</div>
				</DialogContent>
				{categoryTypeDialogue.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{categoryTypeDialogue.submitting ? (
								<Button disableElevation variant="contained" color="primary" type="button" disabled>
									Please wait ... <CircularProgress className="ml-16" size={22} color="inherit" />
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
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
								onClick={handleSubmit}
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

export default CategoryTypeDialogue;
