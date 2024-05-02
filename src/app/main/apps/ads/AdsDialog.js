/* eslint-disable jsx-a11y/label-has-associated-control */
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
import { TextFieldFormsy, SelectFormsy, FileChooserFormsy } from '@fuse/core/formsy';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import helpers from 'app/utils/helpers';
import { closeNewUserDialog, closeEditUserDialog, addAds } from './store/adsSlice';

const defaultFormState = {
	id: '',
	group: '',
	status_value: '',
	image1: '',
	image2: '',
	image3: ''
};

function AdsDialog(props) {
	const dispatch = useDispatch();

	const userDialog = useSelector(({ ads }) => ads.ads.userDialog);

	const { loading: userDialogLoading } = userDialog;
	const [isFormValid, setIsFormValid] = useState(false);
	const [externalValidationErrors, setExternalValidationErrors] = useState({});
	const [imagePreview1, setImagePreview1] = useState('');
	const [imagePreview2, setImagePreview2] = useState('');
	const [imagePreview3, setImagePreview3] = useState('');

	const fileInputRef1 = useRef(null);
	const fileInputRef2 = useRef(null);
	const fileInputRef3 = useRef(null);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (userDialog.type === 'edit' && userDialog.data) {
			setForm({ ...userDialog.data });
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
			formRef.current.setExternalValidationErrors(validationErrors);
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
			// dispatch(addUser({ user: form, closeNewUserDialog: true }));
			console.log('form', form);
			dispatch(addAds({ ads: form, closeNewUserDialog: true }));
		} else {
			closeComposeDialog();
			// dispatch(updateUser(form));
		}
	}

	const handleImageUpload = index => {
		const refs = [fileInputRef1, fileInputRef2, fileInputRef3];
		const setPreviewFunctions = [setImagePreview1, setImagePreview2, setImagePreview3];

		if (refs[index].current && refs[index].current.files.length > 0) {
			const { files } = refs[index].current;
			const file = files[0];

			// Update the form state with the new image data
			setForm(prevForm => {
				const updatedForm = { ...prevForm };
				updatedForm[`image${index + 1}`] = {
					media_id: null,
					file,
					file_name: file.name,
					mime_type: file.type,
					type: 'image',
					size_in_bytes: file.size
				};

				return updatedForm;
			});
		} else {
			console.log(`No files selected for image ${index + 1} or the file input is not returning files.`);
		}
	};

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
						<Typography variant="subtitle1">Loading Ads ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			)}
			{!userDialogLoading ? (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full ">
							<Typography variant="subtitle1" color="inherit">
								{userDialog.type === 'new' ? 'New Group' : 'Edit Group'}
							</Typography>
						</Toolbar>
						<div className="flex flex-col items-center justify-center pb-24">
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
									<Icon color="action">group</Icon>
								</div>
								<TextFieldFormsy
									className="mb-24"
									type="text"
									name="group"
									label="Ads Name"
									value={form.group}
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
										<Icon color="action">image</Icon>
									</div>
									<FileChooserFormsy
										className="mb-24"
										name="image1"
										label="Image 1"
										value={form.image1}
										variant="outlined"
										onChange={() => handleImageUpload(0)}
										fullWidth
										fileRef={fileInputRef1}
										acceptFileTypes="image/*"
									/>
								</div>
							)}

							{userDialog.type === 'new' && (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">image</Icon>
									</div>
									<FileChooserFormsy
										className="mb-24"
										name="image2"
										label="Image 2"
										value={form.image2}
										variant="outlined"
										onChange={() => handleImageUpload(1)}
										fullWidth
										fileRef={fileInputRef2}
										acceptFileTypes="image/*"
									/>
								</div>
							)}

							{userDialog.type === 'new' && (
								<div className="flex">
									<div className="min-w-48 pt-20">
										<Icon color="action">image</Icon>
									</div>
									<FileChooserFormsy
										className="mb-24"
										name="image3"
										label="Image 3"
										value={form.image3}
										variant="outlined"
										onChange={() => handleImageUpload(2)}
										fullWidth
										fileRef={fileInputRef3}
										acceptFileTypes="image/*"
									/>
								</div>
							)}

							<div className="flex mt-8">
								<div className="min-w-48 pt-20">
									<Icon color="action">status</Icon>
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

export default AdsDialog;
