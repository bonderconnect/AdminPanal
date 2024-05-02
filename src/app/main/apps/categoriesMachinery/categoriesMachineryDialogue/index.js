/* eslint-disable camelcase */
import { SelectFormsy, TextFieldFormsy } from '@fuse/core/formsy';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	insertCategoriesMachinery,
	closeEditCategoriesMachineryDialog,
	closeNewCategoriesMachineryDialog,
	getCategoriesMachinery,
	updateCategoriesMachinery,
	fileSelected,
	uploadFile,
	resetUploadUrl
} from '../store/CategoriesMachinerySlice';

const defaultFormState = {
	entity_id: null,
	category_id: null,
	image: null,
	title: null,
	category_description: null,
	status_value: null
};

const statusSelectOptions = [
	{ value: 1, label: 'active' },
	{ value: 0, label: 'suspend / inActive' }
];

function UserDialog(props) {
	const dispatch = useDispatch();
	const categoriesMachineryDialogue = useSelector(
		({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.categoriesMachineryDialogue
	);
	const selectedFile = useSelector(
		({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.selectedFile
	);
	const uploadStatus = useSelector(
		({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.uploadStatus
	);
	const uploadUrl = useSelector(({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.uploadUrl);
	const error = useSelector(({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.error);
	const media_id = useSelector(({ categoriesMachineryApp }) => categoriesMachineryApp.categoriesMachinery.media_id);
	const handleUpload = () => {
		console.log(`🚀  handleUpload  selectedFile:`, selectedFile);
		dispatch(uploadFile(selectedFile));
	};

	const handleFileChange = event => {
		const file = event.target.files[0];
		// Create a new object without lastModifiedDate but retain other file properties
		const fileWithoutLastModifiedDate = {
			file_name: file.name,
			size_in_bytes: file.size,
			mime_type: file.type,
			type: 'image',
			lastModifiedDate: null
		};
		dispatch(fileSelected(fileWithoutLastModifiedDate));
	};
	const handleReset = () => {
		dispatch(resetUploadUrl());
	};

	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (categoriesMachineryDialogue.type === 'edit' && categoriesMachineryDialogue.data) {
			setForm({ ...categoriesMachineryDialogue.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (categoriesMachineryDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...categoriesMachineryDialogue?.data
			});
		}
	}, [categoriesMachineryDialogue?.data, categoriesMachineryDialogue?.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (categoriesMachineryDialogue?.props.open) {
			initDialog();
		}
	}, [categoriesMachineryDialogue?.props?.open, initDialog]);

	function closeComposeDialog() {
		return categoriesMachineryDialogue?.type === 'edit'
			? dispatch(closeEditCategoriesMachineryDialog())
			: dispatch(closeNewCategoriesMachineryDialog());
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
		if (categoriesMachineryDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addCategoriesMachineryPayload = { ...form };
			delete addCategoriesMachineryPayload.id;
			delete addCategoriesMachineryPayload.CategoriesMachinery_id;
			delete addCategoriesMachineryPayload[''];
			if (!addCategoriesMachineryPayload?.media_id) {
				addCategoriesMachineryPayload.media_id = media_id;
			}
			const data = {
				company_profile_type: 'machinery',
				category_title: addCategoriesMachineryPayload?.title,
				category_description: addCategoriesMachineryPayload?.category_description,
				status: addCategoriesMachineryPayload?.status_value,
				media_id: addCategoriesMachineryPayload?.media_id,
				category_tag_id: 2
			};
			console.log('addCategoriesMachineryPayload:', data);
			dispatch(insertCategoriesMachinery(data));
			closeComposeDialog();
		} else {
			const updateCategoriesMachineryPayload = { ...form };
			delete updateCategoriesMachineryPayload.undefined;
			delete updateCategoriesMachineryPayload.CategoriesMachinery_id;
			console.log(`🚀  handleSubmit  updateCategoriesMachineryPayload:`, updateCategoriesMachineryPayload);
			if (!updateCategoriesMachineryPayload?.media_id) {
				updateCategoriesMachineryPayload.media_id = media_id;
			}
			if (!updateCategoriesMachineryPayload?.image) {
				updateCategoriesMachineryPayload.image = uploadUrl;
			}
			// console.log(
			// 	`🚀  handleSubmit  updateCategoriesMachineryPayload:`,
			// 	updateCategoriesMachineryPayload
			// );
			const data = {
				category_id: updateCategoriesMachineryPayload?.category_id,
				category_title: updateCategoriesMachineryPayload?.title,
				category_description: updateCategoriesMachineryPayload?.category_description,
				status: updateCategoriesMachineryPayload?.status_value,
				image_file_key: updateCategoriesMachineryPayload?.image?.split('/')?.pop(),
				media_id: updateCategoriesMachineryPayload?.media_id,
				company_profile_type: updateCategoriesMachineryPayload?.company_profile_type
			};
			dispatch(updateCategoriesMachinery(data));
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...categoriesMachineryDialogue?.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{categoriesMachineryDialogue?.type === 'new'
							? 'New Categories Machinery'
							: 'Edit Categories Machinery'}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				noValidate
				ref={formRef}
				className="flex flex-col md:overflow-hidden"
			>
				<DialogContent classes={{ root: 'p-24' }}>
					{categoriesMachineryDialogue?.type === 'edit' ? (
						<div className="flex">
							<div className="min-w-48 pt-20">
								<Icon color="action">folder</Icon>
							</div>
							<div className="flex mb-16 flex-col flex-1">
								<TextFieldFormsy
									className="mb-4"
									type="text"
									name="category_id"
									label="Category ID"
									value={form.category_id}
									variant="outlined"
									onChange={handleChangeMiddleware}
									fullWidth
									required
								/>
							</div>
						</div>
					) : null}

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">insert_drive_file</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="image"
								label="Image Url"
								value={uploadUrl === 'idle' ? form.image : uploadUrl}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
						</div>
					</div>
					<div className="my-20 space-x-32">
						<label htmlFor="raised-button-file">
							<input
								accept="image/*"
								style={{ display: 'none' }}
								id="raised-button-file"
								type="file"
								onChange={handleFileChange}
							/>
							<Button variant="raised" component="span">
								Select File
							</Button>
						</label>
						<Button
							variant="raised"
							onClick={handleUpload}
							disabled={!selectedFile || uploadStatus === 'pending'}
						>
							Upload
						</Button>
						<Button
							variant="raised"
							onClick={handleReset}
							disabled={!selectedFile || uploadStatus === 'pending'}
						>
							Reset URL
						</Button>
					</div>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">query_builder</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="title"
								label="Title"
								value={form.title}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className="italic text-xs" variant="body2" gutterBottom>
								Keep this field empty to make Title empty
							</Typography>
						</div>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">attach_money</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="category_description"
								label="Description"
								value={form.category_description}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className="italic text-xs" variant="body2" gutterBottom>
								Keep this field empty to make Description empty
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
							{statusSelectOptions.map(option => (
								<MenuItem key={option.value} value={option.label}>
									{option.label}
								</MenuItem>
							))}
						</SelectFormsy>
					</div>
				</DialogContent>

				{categoriesMachineryDialogue?.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{categoriesMachineryDialogue.submitting ? (
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
				{uploadStatus === 'fulfilled' && <p>File uploaded successfully.</p>}
				{uploadStatus === 'rejected' && <p>Error: {error}</p>}
			</Formsy>
		</Dialog>
	);
}

export default UserDialog;
