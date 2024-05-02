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
	addCategoriesConstructionMaterials,
	closeEditCategoriesConstructionMaterialsDialog,
	closeNewCategoriesConstructionMaterialsDialog,
	getCategoriesConstructionMaterials,
	updateCategoriesConstructionMaterials,
	fileSelected,
	uploadFile,
	resetUploadUrl
} from '../store/CategoriesConstructionMaterialsSlice';

const defaultFormState = {
	entity_id: null,
	product_id: null,
	name: null,
	status: null,
	image: null,
	description: null,
	category_id: null
};

const statusSelectOptions = [
	{ value: 1, label: 'active' },
	{ value: 0, label: 'suspend / inActive' }
];
const categoriesSelectOptions = [
	{ value: 19, label: 'Spare parts' },
	{ value: 21, label: 'Vehicle accessories' },
	{ value: 16, label: 'Curtain' },
	{ value: 11, label: 'Electric and Plumbing' },
	{ value: 14, label: 'Flooring' },
	{ value: 13, label: 'Plastering' },
	{ value: 15, label: 'Roofing' },
	{ value: 26, label: 'Interior Designing' },
	{ value: 27, label: 'Fabrication Work' },
	{ value: 28, label: 'Concrete Work' },
	{ value: 29, label: 'Carpenter' },
	{ value: 31, label: 'Mesthiri' },
	{ value: 32, label: 'Pucher Works' },
	{ value: 33, label: 'Work Shop' },
	{ value: 34, label: 'Tyre Resoling' },
	{ value: 37, label: 'Sticker Works' },
	{ value: 41, label: 'Ambulance / Emergency vehicle' },
	{ value: 43, label: 'Taxi Services' },
	{ value: 6, label: 'Interlock' },
	{ value: 7, label: 'architect' },
	{ value: 18, label: 'Machinery Companies' },
	{ value: 5, label: 'Cement Dealers' },
	{ value: 4, label: 'Hollow Bricks' },
	{ value: 40, label: 'Mechanical works' },
	{ value: 22, label: 'Vehicles' },
	{ value: 17, label: 'Machineries and Accessories' },
	{ value: 39, label: 'Engine Oil' },
	{ value: 23, label: 'Tyre' },
	{ value: 36, label: 'Paint Works' },
	{ value: 3, label: 'Mines and Crushers' },
	{ value: 8, label: 'M Brick' },
	{ value: 38, label: 'Aluminium Fabrication' },
	{ value: 12, label: 'Painting' },
	{ value: 10, label: 'Developers' },
	{ value: 9, label: 'Architect' },
	{ value: 20, label: 'Mechanical works' },
	{ value: 2, label: 'Cement Bricks' }
];

function UserDialog(props) {
	const dispatch = useDispatch();

	const categoriesConstructionMaterialsDialogue = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.categoriesConstructionMaterialsDialogue
	);
	const selectedFile = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.selectedFile
	);
	const uploadStatus = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.uploadStatus
	);
	const uploadUrl = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.uploadUrl
	);
	const error = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.error
	);
	const media_id = useSelector(
		({ categoriesConstructionMaterialsApp }) =>
			categoriesConstructionMaterialsApp.categoriesConstructionMaterials.media_id
	);
	const handleUpload = () => {
		console.log(`🚀  handleUpload  selectedFile:`, selectedFile);
		dispatch(uploadFile(selectedFile));
	};

	const handleFileChange = event => {
		const file = event.target.files[0];
		console.log(`🚀  handleFileChange  file:`, file);
		// Create a new object without lastModifiedDate but retain other file properties
		const fileWithoutLastModifiedDate = {
			file_name: file.name,
			size_in_bytes: file.size,
			mime_type: file.type,
			type: 'image',
			lastModifiedDate: null
			// or remove this property if not needed
		};
		console.log('🚀 handleFileChange file:', fileWithoutLastModifiedDate);
		dispatch(fileSelected(fileWithoutLastModifiedDate));
	};
	const handleReset = () => {
		dispatch(resetUploadUrl());
	};

	console.log(`🚀  UserDialog  categoriesConstructionMaterialsDialogue:`, categoriesConstructionMaterialsDialogue);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (categoriesConstructionMaterialsDialogue.type === 'edit' && categoriesConstructionMaterialsDialogue.data) {
			console.log(
				`🚀  initDialog  categoriesConstructionMaterialsDialogue.data:`,
				categoriesConstructionMaterialsDialogue.data
			);
			setForm({ ...categoriesConstructionMaterialsDialogue.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (categoriesConstructionMaterialsDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...categoriesConstructionMaterialsDialogue?.data
			});
		}
	}, [categoriesConstructionMaterialsDialogue?.data, categoriesConstructionMaterialsDialogue?.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (categoriesConstructionMaterialsDialogue?.props.open) {
			initDialog();
		}
	}, [categoriesConstructionMaterialsDialogue?.props?.open, initDialog]);

	function closeComposeDialog() {
		return categoriesConstructionMaterialsDialogue?.type === 'edit'
			? dispatch(closeEditCategoriesConstructionMaterialsDialog())
			: dispatch(closeNewCategoriesConstructionMaterialsDialog());
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
		if (categoriesConstructionMaterialsDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addCategoriesConstructionMaterialsPayload = { ...form };
			delete addCategoriesConstructionMaterialsPayload.id;
			delete addCategoriesConstructionMaterialsPayload.CategoriesConstructionMaterials_id;
			delete addCategoriesConstructionMaterialsPayload[''];
			delete addCategoriesConstructionMaterialsPayload.undefined;
			if (!addCategoriesConstructionMaterialsPayload?.media_id) {
				addCategoriesConstructionMaterialsPayload.media_id = media_id;
			}
			if (!addCategoriesConstructionMaterialsPayload?.image) {
				addCategoriesConstructionMaterialsPayload.image = uploadUrl;
			}

			console.log('addCategoriesConstructionMaterialsPayload:', addCategoriesConstructionMaterialsPayload);
			const data = {
				product_id: addCategoriesConstructionMaterialsPayload?.product_id,
				name: addCategoriesConstructionMaterialsPayload?.name,
				description: addCategoriesConstructionMaterialsPayload?.description,
				status: addCategoriesConstructionMaterialsPayload?.status,
				image_file_key: addCategoriesConstructionMaterialsPayload?.image?.split('/')?.pop(),
				media_id: addCategoriesConstructionMaterialsPayload?.media_id,
				category_id: addCategoriesConstructionMaterialsPayload?.category_id
			};
			dispatch(
				addCategoriesConstructionMaterials({
					CategoriesConstructionMaterials: data,
					closeNewCategoriesConstructionMaterialsDialog: true
				})
			);
			closeComposeDialog();
		} else {
			const updateCategoriesConstructionMaterialsPayload = { ...form };
			delete updateCategoriesConstructionMaterialsPayload.undefined;
			delete updateCategoriesConstructionMaterialsPayload.CategoriesConstructionMaterials_id;
			if (!updateCategoriesConstructionMaterialsPayload?.media_id) {
				updateCategoriesConstructionMaterialsPayload.media_id = media_id;
			}
			if (!updateCategoriesConstructionMaterialsPayload?.image) {
				updateCategoriesConstructionMaterialsPayload.image = uploadUrl;
			}
			console.log(
				`🚀  handleSubmit  updateCategoriesConstructionMaterialsPayload:`,
				updateCategoriesConstructionMaterialsPayload
			);
			const data = {
				product_id: updateCategoriesConstructionMaterialsPayload?.product_id,
				name: updateCategoriesConstructionMaterialsPayload?.name,
				description: updateCategoriesConstructionMaterialsPayload?.description,
				status: updateCategoriesConstructionMaterialsPayload?.status,
				image_file_key: updateCategoriesConstructionMaterialsPayload?.image?.split('/')?.pop(),
				media_id: updateCategoriesConstructionMaterialsPayload?.media_id
			};
			console.log(`🚀  handleSubmit  data:`, data);
			dispatch(updateCategoriesConstructionMaterials(data));
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...categoriesConstructionMaterialsDialogue?.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subname1" color="inherit">
						{categoriesConstructionMaterialsDialogue?.type === 'new'
							? 'New Categories ConstructionMaterials'
							: 'Edit Categories ConstructionMaterials'}
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
					{categoriesConstructionMaterialsDialogue?.type === 'edit' ? (
						<div className="flex">
							{/* <div className="min-w-48 pt-20">
								<Icon color="action">folder</Icon>
							</div>
							<div className="flex mb-16 flex-col flex-1">
								<TextFieldFormsy
									className="mb-4"
									type="text"
									name="product_id"
									label="Product ID"
									value={form.product_id}
									variant="outlined"
									onChange={handleChangeMiddleware}
									fullWidth
									required
								/>
							</div> */}
						</div>
					) : (
						<div className="flex mt-8 z-0">
							<div className="min-w-48 pt-20">
								<Icon color="action">perm_identity</Icon>
							</div>

							<SelectFormsy
								className="mb-16 flex-1"
								name="category_id"
								label="category_id"
								value={form.category_id}
								variant="outlined"
								autoWidth
								required
								onChange={handleChangeMiddleware}
							>
								{categoriesSelectOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</SelectFormsy>
						</div>
					)}

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
								name="name"
								label="Title"
								value={form.name}
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
								name="description"
								label="Description"
								value={form.description}
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
							name="status"
							label="status"
							value={form.status}
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

				{categoriesConstructionMaterialsDialogue?.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{categoriesConstructionMaterialsDialogue.submitting ? (
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
