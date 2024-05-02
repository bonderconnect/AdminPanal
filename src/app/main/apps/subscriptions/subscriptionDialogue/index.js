import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DialogContentText from '@material-ui/core/DialogContentText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { InputAdornment } from '@material-ui/core';
import { TextFieldFormsy, SelectFormsy, CkeditorFormsy } from '@fuse/core/formsy';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import helpers from 'app/utils/helpers';
import PackageSelection from './packageSelection';
import {
	updateSubscription,
	addSubscription,
	closeNewSubscriptionDialog,
	closeEditSubscriptionDialog
} from '../store/subscriptionsSlice';

const defaultFormState = {
	entity_id: null,
	current_price: null,
	initial_price: null,
	subscription_duration: null,
	entity_type_value: 1,
	status_value: null,
	serving_priority: null
};

const statusSelectOptions = [
	{ value: 1, label: 'Active' },
	{ value: 0, label: 'Suspend / InActive' }
];

function UserDialog(props) {
	const dispatch = useDispatch();
	const subscriptionDialogue = useSelector(
		({ subscriptionsApp }) => subscriptionsApp.subscriptions.subscriptionDialogue
	);
	const [isFormValid, setIsFormValid] = useState(false);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const formRef = useRef(null);

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (subscriptionDialogue.type === 'edit' && subscriptionDialogue.data) {
			const editSubscriptionForm = { ...subscriptionDialogue.data };
			if (!editSubscriptionForm.subscription_duration) {
				editSubscriptionForm.subscription_duration = 0;
			}
			if (!editSubscriptionForm.current_price) {
				editSubscriptionForm.current_price = 0;
			}
			setForm({ ...editSubscriptionForm });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (subscriptionDialogue.type === 'new') {
			setForm({
				...defaultFormState,
				...subscriptionDialogue.data
			});
		}
	}, [subscriptionDialogue.data, subscriptionDialogue.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (subscriptionDialogue.props.open) {
			initDialog();
		}
	}, [subscriptionDialogue.props.open, initDialog]);

	function closeComposeDialog() {
		return subscriptionDialogue.type === 'edit'
			? dispatch(closeEditSubscriptionDialog())
			: dispatch(closeNewSubscriptionDialog());
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
		if (subscriptionDialogue.type === 'new') {
			//  dialog will close after successfull completion of series of api's
			const addSubscriptionPayload = { ...form };
			delete addSubscriptionPayload.id;
			delete addSubscriptionPayload.subscription_id;
			delete addSubscriptionPayload[''];
			console.log('addSubscriptionPayload:', addSubscriptionPayload);
			dispatch(addSubscription({ subscription: addSubscriptionPayload, closeNewSubscriptionDialog: true }));
		} else {
			const updateSubscriptionPayload = { ...form };
			delete updateSubscriptionPayload.undefined;
			delete updateSubscriptionPayload.subscription_id;
			dispatch(
				updateSubscription({ subscription: updateSubscriptionPayload, subscriptionId: form.subscription_id })
			);
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...subscriptionDialogue.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{subscriptionDialogue.type === 'new' ? 'New Subscription' : 'Edit Subscription'}
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
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">query_builder</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="subscription_duration"
								label="Duration (In Days)"
								value={form.subscription_duration}
								validations={{
									isNumeric: true
								}}
								validationErrors={{
									isNumeric: 'Must contain a valid number'
								}}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className="italic text-xs" variant="body2" gutterBottom>
								Keep this field empty to make the subscription lifetime
							</Typography>
						</div>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">money_off</Icon>
						</div>
						<div className="flex mb-16 flex-col flex-1">
							<TextFieldFormsy
								className="mb-4"
								type="text"
								name="initial_price"
								label="Initial price"
								value={form.initial_price}
								validations={{
									isNumeric: true
								}}
								validationErrors={{
									isNumeric: 'Must contain a valid number'
								}}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className="italic text-xs" variant="body2" gutterBottom>
								This will show as original price and current price will show as offer price. Please keep
								this field empty if don't need to show the offer price but only need to show the current
								price.
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
								name="current_price"
								label="Current price"
								value={form.current_price}
								validations={{
									isNumeric: true
								}}
								validationErrors={{
									isNumeric: 'Must contain a valid number'
								}}
								variant="outlined"
								onChange={handleChangeMiddleware}
								fullWidth
							/>
							<Typography className="italic text-xs" variant="body2" gutterBottom>
								Keep this field empty to make the subscription free
							</Typography>
						</div>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">local_mall</Icon>
						</div>
						<PackageSelection
							value={form.entity_id}
							name="entity_id"
							label="Select Package"
							validationErrors={{
								required: 'Package is required'
							}}
							onChange={handleChangeMiddleware}
							required
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">low_priority</Icon>
						</div>
						<TextFieldFormsy
							className="mb-24"
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
							helperText="The highest number have higher priority in serving order"
							variant="outlined"
							onChange={handleChangeMiddleware}
							fullWidth
						/>
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

				{subscriptionDialogue.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							{subscriptionDialogue.submitting ? (
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

export default UserDialog;
