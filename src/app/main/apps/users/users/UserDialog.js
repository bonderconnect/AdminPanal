import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChipSelectFormsy from '@fuse/core/formsy/ChipSelectFormsy';
import MenuItem from '@material-ui/core/MenuItem';
import { InputAdornment } from '@material-ui/core';
import { TextFieldFormsy, SelectFormsy } from '@fuse/core/formsy';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import helpers from 'app/utils/helpers';
import { updateUser, addUser, closeNewUserDialog, closeEditUserDialog } from '../store/usersSlice';

const defaultFormState = {
	id: '',
	name: '',
	avatar: 'assets/images/avatars/profile.jpg',
	email: '',
	phone: '',
	status_value: '',
	password: '',
	user_roles: []
};

function UserDialog(props) {
	const dispatch = useDispatch();
	const userDialog = useSelector(({ usersApp }) => usersApp.users.userDialog);
	const { loading: userDialogLoading } = userDialog;
	const [isFormValid, setIsFormValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [externalValidationErrors, setExternalValidationErrors] = useState({});

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (userDialog.type === 'edit' && userDialog.data) {
			// setForm({ ...userDialog.data });
			setForm({
				...defaultFormState,
				...userDialog.data
			});
		}

		/**
		 * Dialog type: 'new'
		 */
		if (userDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...userDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [userDialog.data, userDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (userDialog.props.open) {
			initDialog();
		}
	}, [userDialog.props.open, initDialog]);

	useEffect(() => {
		/**
		 * Listening to server side validations
		 */

		// setExternalValidationErrors(validationErrors);
		if (userDialog.errors && formRef.current) {
			const validationErrors = {};
			Object.keys(userDialog.errors).forEach(errorField => {
				validationErrors[errorField] = userDialog.errors[errorField].error;
			});
			formRef.current.updateInputsWithError(validationErrors);
		}
	}, [userDialog.errors]);

	function closeComposeDialog() {
		return userDialog.type === 'edit' ? dispatch(closeEditUserDialog()) : dispatch(closeNewUserDialog());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit() {
		if (userDialog.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			dispatch(addUser({ user: form, closeNewUserDialog: true }));
		} else {
			closeComposeDialog();
			dispatch(updateUser(form));
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...userDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{userDialogLoading && (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading user ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!userDialogLoading ? (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								{userDialog.type === 'new' ? 'New User' : 'Edit User'}
							</Typography>
						</Toolbar>
						<div className="flex flex-col items-center justify-center pb-24">
							<Avatar className="w-96 h-96" alt="user avatar" src={form.avatar} />
							{userDialog.type === 'edit' && (
								<Typography variant="h6" color="inherit" className="pt-8">
									{form.name}
								</Typography>
							)}
						</div>
					</AppBar>
					<Formsy
						onValidSubmit={handleSubmit}
						onValid={enableButton}
						onInvalid={disableButton}
						ref={formRef}
						className="flex flex-col md:overflow-hidden"
						validationErrors={externalValidationErrors}
					>
						<DialogContent classes={{ root: 'p-24' }}>
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">account_circle</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
									type="text"
									name="name"
									label="Full / Display name"
									value={form.name}
									validations={{
										minLength: 4
									}}
									validationErrors={{
										minLength: 'Min character length is 4'
									}}
									variant="outlined"
									onChange={handleChange}
									required
									fullWidth
								/>
							</div>
							{userDialog.type === 'new' && (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">phone</Icon>
									</div>
									<TextFieldFormsy
										className="mb-24"
										type="text"
										name="phone"
										label="Phone"
										value={form.phone}
										validations={{
											isNumeric: true,
											isLength: 10
										}}
										validationErrors={{
											isLength: 'Must be a valid phone number with 8 digit',
											isNumeric: 'Must be a valid phone number with 8 digit'
										}}
										variant="outlined"
										onChange={handleChange}
										fullWidth
									/>
								</div>
							)}

							{userDialog.type === 'new' && (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">email</Icon>
									</div>
									<TextFieldFormsy
										className="mb-24"
										type="text"
										name="email"
										label="Email"
										value={form.email}
										validations={{
											isEmail: true
										}}
										validationErrors={{
											isEmail: 'Must be a valid email'
										}}
										variant="outlined"
										onChange={handleChange}
										required
										fullWidth
									/>
								</div>
							)}

							{userDialog.type === 'new' ? (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">lock</Icon>
									</div>

									<TextFieldFormsy
										className="mb-16"
										type="password"
										name="password"
										label="Password"
										value={form.password}
										validations={{
											minLength: 8
										}}
										validationErrors={{
											minLength: 'Min character length is 8'
										}}
										InputProps={{
											className: 'pr-2',
											type: showPassword ? 'text' : 'password',
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowPassword(!showPassword)}>
														<Icon className="text-20" color="action">
															{showPassword ? 'visibility' : 'visibility_off'}
														</Icon>
													</IconButton>
												</InputAdornment>
											)
										}}
										variant="outlined"
										onChange={handleChange}
										required
										fullWidth
									/>
								</div>
							) : null}

							<div className="flex mt-8">
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
									onChange={handleChange}
								>
									{helpers.userStatusSelectOptions.map(item => (
										<MenuItem key={`-${item.value}`} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</SelectFormsy>
							</div>

							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">assignment_ind</Icon>
								</div>
								<ChipSelectFormsy
									name="user_roles"
									value={form.user_roles}
									options={[
										{ label: 'User / Student', value: 'USER' },
										{ label: 'Faculty', value: 'FACULTY' },
										{ label: 'Admin', value: 'ADMIN' },
										{ label: 'Super Admin', value: 'SUPER-ADMIN' }
									]}
									onChange={handleChange}
									label="User Roles"
									className="mb-36"
								/>
							</div>
						</DialogContent>

						{userDialog.type === 'new' ? (
							<DialogActions className="justify-between p-8">
								<div className="px-16">
									{userDialog.submitting ? (
										<Button
											disableElevation
											variant="contained"
											color="primary"
											type="button"
											disabled
										>
											Please wait ...{' '}
											<CircularProgress className="ml-16" size={22} color="inherit" />
										</Button>
									) : (
										<Button
											variant="contained"
											color="primary"
											onClick={handleChange}
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
										onClick={handleChange}
										disabled={!isFormValid}
									>
										Save
									</Button>
								</div>
							</DialogActions>
						)}
					</Formsy>
				</>
			) : null}
		</Dialog>
	);
}

export default UserDialog;
