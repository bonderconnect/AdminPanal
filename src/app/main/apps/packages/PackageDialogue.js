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
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePackage, addPackage, closeNewPackageDialog, closeEditPackageDialog } from './store/packagesSlice';

const defaultFormState = {
	package_id: '',
	title: '',
	description: ''
};

function PackageDialog(props) {
	const dispatch = useDispatch();
	const packageDialogue = useSelector(({ packagesApp }) => packagesApp.packages.packageDialogue);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (packageDialogue.type === 'edit' && packageDialogue.data) {
			setForm({ ...packageDialogue.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (packageDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...packageDialogue.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [packageDialogue.data, packageDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (packageDialogue.props.open) {
			initDialog();
		}
	}, [packageDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return packageDialogue.type === 'edit' ? dispatch(closeEditPackageDialog()) : dispatch(closeNewPackageDialog());
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
		if (packageDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addPackagePayload = { ...form };
			delete addPackagePayload.id;
			delete addPackagePayload.package_id;
			dispatch(addPackage({ package: addPackagePayload, closeNewPackageDialog: true }));
		} else {
			const updatePackagePayload = { ...form };
			delete updatePackagePayload.undefined;
			delete updatePackagePayload.package_id;
			dispatch(updatePackage({ package: updatePackagePayload, package_id: form.package_id }));
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...packageDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{packageDialogue.type === 'new' ? 'New Package' : 'Edit Package'}
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
				</DialogContent>
				{packageDialogue.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{packageDialogue.submitting ? (
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

export default PackageDialog;
