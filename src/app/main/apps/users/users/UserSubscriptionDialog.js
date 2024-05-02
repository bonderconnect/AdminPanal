import _ from '@lodash';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeUserSubscriptionDialog,
	getSubscriptionsAvailable,
	getUserSubscriptions,
	updateUserSubscription
} from '../store/usersSlice';

const useStyles = makeStyles({
	subscriptionItem: {
		'&.completed': {
			background: 'rgba(0,0,0,0.03)',
			'& .package-title, & .package-description': {
				textDecoration: 'line-through'
			}
		}
	}
});

function UserSubscriptionDialog(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userSubscriptionDialog = useSelector(({ usersApp }) => usersApp.users.userSubscriptionDialog);
	const newSubscriptions = useRef([]);
	const deletedSubscriptions = useRef([]);
	const [subscriptionSelections, setSubscriptionSelection] = useState([]);

	React.useEffect(() => {
		setSubscriptionSelection(userSubscriptionDialog.data.userSubscriptions.ids);
	}, [userSubscriptionDialog.data.userSubscriptions.ids]);

	const initDialog = useCallback(() => {
		if (!userSubscriptionDialog.data.subscriptions.ids.length) {
			dispatch(getSubscriptionsAvailable());
		}
		dispatch(getUserSubscriptions(userSubscriptionDialog.userId));
		newSubscriptions.current = [];
		deletedSubscriptions.current = [];
	}, [userSubscriptionDialog.data.subscriptions, userSubscriptionDialog.userId]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (userSubscriptionDialog.props.open) {
			initDialog();
		}
	}, [userSubscriptionDialog.props.open]);

	function closeComposeDialog() {
		return dispatch(closeUserSubscriptionDialog());
	}

	function handleSubmit(event) {
		event.preventDefault();
		dispatch(
			updateUserSubscription({
				newSubscriptions: newSubscriptions.current,
				deletedSubscriptions: deletedSubscriptions.current,
				userId: userSubscriptionDialog.userId
			})
		);
		closeComposeDialog();
	}

	function onselectionchange(suscriptionId) {
		if (subscriptionSelections.indexOf(suscriptionId) !== -1) {
			// unselecting item

			if (userSubscriptionDialog.data.userSubscriptions.ids.indexOf(suscriptionId) !== -1) {
				deletedSubscriptions.current.push(suscriptionId);
			} else if (newSubscriptions.current.indexOf(suscriptionId) !== -1) {
				const index = newSubscriptions.current.indexOf(suscriptionId);
				newSubscriptions.current.splice(index, 1);
			}

			setSubscriptionSelection(state => {
				const updatedState = [...state];
				const index = state.indexOf(suscriptionId);
				updatedState.splice(index, 1);
				return updatedState;
			});
		} else {
			// selecting item

			setSubscriptionSelection(state => {
				return [...state, suscriptionId];
			});

			if (userSubscriptionDialog.data.userSubscriptions.ids.indexOf(suscriptionId) === -1) {
				newSubscriptions.current.push(suscriptionId);
			}

			if (deletedSubscriptions) {
				const index = deletedSubscriptions.current.indexOf(suscriptionId);
				deletedSubscriptions.current.splice(index, 1);
			}
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...userSubscriptionDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{!(userSubscriptionDialog.data.userSubscriptions && userSubscriptionDialog.data.subscriptions) &&
			userSubscriptionDialog.props.open ? (
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<Typography variant="subtitle1">Loading user subscriptions ...</Typography>
						<CircularProgress className="ml-16" size={26} color="inherit" />
					</div>
				</DialogContent>
			) : (
				<>
					<AppBar position="static" elevation={1}>
						<Toolbar className="flex w-full">
							<Typography variant="subtitle1" color="inherit">
								Manage Subscriptions
							</Typography>
						</Toolbar>
					</AppBar>
					<DialogContent classes={{ root: 'p-24' }}>
						<div className="flex">
							<List className="p-0 w-full">
								{Object.values(userSubscriptionDialog.data.subscriptions.entities).map(
									subscriptionItem => (
										<ListItem
											className={clsx(
												classes.todoItem,
												'border-solid border-b-1 py-16 px-0 sm:px-8'
											)}
											onClick={ev => {
												ev.preventDefault();
												onselectionchange(subscriptionItem.id);
											}}
											dense
											button
										>
											<Checkbox
												tabIndex={-1}
												disableRipple
												checked={subscriptionSelections.indexOf(subscriptionItem.id) !== -1}
												onChange={() => onselectionchange(subscriptionItem.id)}
												onClick={ev => ev.stopPropagation()}
											/>

											<div className="flex flex-1 flex-col relative overflow-hidden px-8">
												<Typography
													variant="subtitle1"
													className="package-title"
													color="textSecondary"
												>
													{subscriptionItem.package_title}
												</Typography>

												<Typography
													color="textSecondary"
													className="package-description"
													gutterBottom
												>
													{_.truncate(
														subscriptionItem.package_description.replace(
															/<(?:.|\n)*?>/gm,
															''
														),
														{
															length: 140
														}
													)}
												</Typography>
												<Typography className="leading-4" variant="overline" display="block">
													Duration:
													{subscriptionItem.subscription_duration
														? ` ${subscriptionItem.subscription_duration} Days`
														: ' Lifetime'}
												</Typography>
												<Typography className="leading-4" variant="overline" display="block">
													Price:{' '}
													{subscriptionItem.current_price &&
													Number(subscriptionItem.current_price)
														? Number(subscriptionItem.current_price)
														: 'Free'}
												</Typography>
											</div>
										</ListItem>
									)
								)}
							</List>
						</div>
					</DialogContent>
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
								Update
							</Button>
						</div>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
}

export default UserSubscriptionDialog;
