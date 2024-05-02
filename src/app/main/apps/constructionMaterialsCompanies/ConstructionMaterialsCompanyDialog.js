import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { showMessage } from 'app/store/fuse/messageSlice';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { DialogActions, DialogContent, DialogTitle } from '@fuse/core/Dialog';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import helpers from 'app/utils/helpers';
import { useForm } from 'react-hook-form';
import {
	closeDialog,
	createConstructionMaterialsCompany,
	updateConstructionMaterialsCompany
} from './store/constructionMaterialsCompanyDialog';
import { getConstructionMaterialsCompanies } from './store/constructionMaterialsCompanies';

function ConstructionMaterialsCompanyDialog(props) {
	const dispatch = useDispatch();
	const {
		open,
		type,
		form,
		submitting,
		loading,
		// Server / request errors
		errors: storeErrors
	} = useSelector(
		({ constructionMaterialsCompaniesApp }) => constructionMaterialsCompaniesApp.constructionMaterialsCompanyDialog
	);
	const [showPassword, setShowPassword] = useState(false);
	const handleClose = () => dispatch(closeDialog());
	const {
		register,
		watch,
		handleSubmit,
		setError,
		formState: { errors, isValid },
		reset
	} = useForm();

	const callback = () => {
		if (type === 'new') {
			dispatch(showMessage({ message: 'Truck driver created successfully' }));
		} else {
			dispatch(showMessage({ message: 'Truck driver updated successfully' }));
		}
		dispatch(getConstructionMaterialsCompanies());
	};

	const onSubmit = (data, e) => {
		if (type === 'new') {
			dispatch(createConstructionMaterialsCompany({ form: data, callback }));
		} else {
			dispatch(updateConstructionMaterialsCompany({ form: data, callback }));
		}
	};

	useEffect(() => {
		if (open) {
			reset();
		}
	}, [open]);

	useEffect(() => {
		if (storeErrors) {
			Object.keys(storeErrors).forEach(errorField => {
				setError(errorField, {
					type: 'manual',
					message: storeErrors[errorField].message
				});
			});
		}
	}, [storeErrors]);

	return (
		<Dialog
			fullWidth
			maxWidth="xs"
			aria-labelledby="new-constructionMaterialsCompany-dialog-title"
			open={open}
			onClose={handleClose}
		>
			<DialogTitle id="new-constructionMaterialsCompany-dialog-title" onClose={handleClose}>
				{type === 'new' ? 'New' : 'Edit'} Truck driver
			</DialogTitle>
			{loading ? (
				<DialogContent classes={{ root: 'p-24' }} dividers>
					<div className="flex">
						<Typography variant="subtitle1">Please wait ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			) : null}
			{!loading ? (
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<DialogContent classes={{ root: 'p-24' }} dividers>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">account_circle</Icon>
							</div>
							<TextField
								{...register('name', {
									value: form.name,
									required: 'This field is required',
									maxLength: {
										value: 64,
										message: 'Maximum characters allowed is 64'
									}
								})}
								label="Fullname / Display name *"
								variant="outlined"
								fullWidth
								className="mb-24"
								type="text"
								name="name"
								error={!!errors.name}
								helperText={errors.name && errors.name.message}
							/>
						</div>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">phone</Icon>
							</div>
							<TextField
								{...register('phone', {
									value: form.phone,
									pattern: {
										value: /^[6-9]\d{9}$/,
										message: 'Please enter a valid phone number'
									}
								})}
								label="Phone"
								variant="outlined"
								fullWidth
								className="mb-24"
								type="text"
								name="phone"
								error={!!errors.phone}
								helperText={errors.phone && errors.phone.message}
							/>
						</div>
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">email</Icon>
							</div>
							<TextField
								{...register('email', {
									value: form.email,
									required: 'This field is required',
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: 'Please enter a valid email'
									}
								})}
								label="Email *"
								variant="outlined"
								fullWidth
								className="mb-24"
								type="text"
								name="email"
								error={!!errors.email}
								helperText={errors.email && errors.email.message}
							/>
						</div>
						{type === 'new' ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">lock</Icon>
								</div>
								<TextField
									{...register('password', {
										required: 'This field is required',
										minLength: {
											value: 8,
											message: 'Password must be atleast 8 characters'
										}
									})}
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
									label="Password"
									variant="outlined"
									fullWidth
									className="mb-24"
									type="password"
									name="password"
									error={!!errors.password}
									helperText={errors.password && errors.password.message}
								/>
							</div>
						) : null}
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">perm_identity</Icon>
							</div>
							<FormControl error={!!errors.status_value} className="mb-16 flex-1" variant="outlined">
								<InputLabel htmlFor="status_value">Status *</InputLabel>
								<Select
									{...register('status_value', {
										required: 'This field is required'
									})}
									defaultValue={
										typeof form.status_value !== 'undefined' ? form.status_value : undefined
									}
									value={
										typeof watch('status_value') !== 'undefined' ? watch('status_value') : undefined
									}
									name="status_value"
									variant="outlined"
									autoWidth
									input={<OutlinedInput labelWidth={'Status'.length * 8} id="status_value" />}
								>
									{helpers.userStatusSelectOptions.map(item => (
										<MenuItem key={`-${item.value}`} value={item.value}>
											{item.label}
										</MenuItem>
									))}
								</Select>
								{errors.status_value && errors.status_value.message ? (
									<FormHelperText>{errors.status_value.message}</FormHelperText>
								) : null}
							</FormControl>
						</div>
					</DialogContent>
					<DialogActions>
						{submitting ? (
							<Button autoFocus type="submit" color="primary">
								Please wait ...
								<CircularProgress className="ml-16" size={22} color="inherit" />
							</Button>
						) : null}
						{!submitting ? (
							<Button autoFocus type="submit" color="primary">
								Save
							</Button>
						) : null}
					</DialogActions>
				</form>
			) : null}
		</Dialog>
	);
}

export default ConstructionMaterialsCompanyDialog;
