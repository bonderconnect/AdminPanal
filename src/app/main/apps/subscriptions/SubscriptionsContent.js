import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import helpers from 'app/utils/helpers';
import {
	setSelectedItem,
	selectSubscriptions,
	openEditSubscriptionDialog,
	deleteSubscription
} from './store/subscriptionsSlice';

const useStyles = makeStyles({
	typeIcon: {
		'&.folder:before': {
			content: "'folder'",
			color: '#FFB300'
		},
		'&.document:before': {
			content: "'insert_drive_file'",
			color: '#1565C0'
		},
		'&.spreadsheet:before': {
			content: "'insert_chart'",
			color: '#4CAF50'
		}
	}
});

function SubscriptionsContent(props) {
	const dispatch = useDispatch();
	const subscriptions = useSelector(selectSubscriptions);
	const selectedItemId = useSelector(({ subscriptionsApp }) => subscriptionsApp.subscriptions.selectedItemId);

	const classes = useStyles();

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<div className="flex px-16">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
							<TableCell>Type</TableCell>
							<TableCell className="hidden sm:table-cell">Entity Title</TableCell>
							<TableCell className="hidden sm:table-cell">Duration ( In Days )</TableCell>
							<TableCell className="hidden sm:table-cell">Current price</TableCell>
							<TableCell className="hidden sm:table-cell">Initial price</TableCell>
							<TableCell className="hidden sm:table-cell text-center">Status</TableCell>
							<TableCell className="hidden sm:table-cell text-center">
								<Tooltip
									title="Subscriptions will show in according to serving priority, highest number will show first"
									placement="top"
								>
									<div className="flex items-center justify-center">
										<span>Serving priority</span>{' '}
										<Icon className="ml-4" color="action">
											low_priority
										</Icon>
									</div>
								</Tooltip>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>

					<TableBody>
						{subscriptions.map(item => {
							return (
								<TableRow
									key={item.subscription_id}
									hover
									onClick={() => dispatch(openEditSubscriptionDialog(item))}
									selected={item.subscription_id === selectedItemId}
									className="cursor-pointer"
								>
									<TableCell className="max-w-64 w-64 p-0 text-center">
										<Icon className={clsx(classes.typeIcon, item.type)} />
									</TableCell>
									<TableCell>Package</TableCell>
									<TableCell>{item.package_title}</TableCell>
									<TableCell className="hidden sm:table-cell">
										{item.subscription_duration || 'Lifetime'}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{Number(item.current_price) || 'Free'}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{Number(item.initial_price) || '-NA-'}
									</TableCell>
									<TableCell className="hidden sm:table-cell px-32 text-center">
										{item.status_value === 1 ? 'Active' : 'Inactive'}
									</TableCell>
									<TableCell className="hidden sm:table-cell text-center">
										{item.serving_priority}
									</TableCell>
									<TableCell>
										<IconButton
											onClick={ev => {
												ev.stopPropagation();
												dispatch(
													openDialog({
														children: (
															<>
																<DialogTitle id="alert-dialog-title">
																	Are you sure want to delete this subscription?
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action irreversible. But you'll able to
																		retreive the subscription's data within 30 days
																		by contacting support team.
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button
																		onClick={() => dispatch(closeDialog())}
																		color="primary"
																	>
																		Cancel
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(
																				deleteSubscription(item.subscription_id)
																			);
																			dispatch(closeDialog());
																		}}
																		color="secondary"
																		autoFocus
																	>
																		Continue
																	</Button>
																</DialogActions>
															</>
														)
													})
												);
											}}
											aria-label="open right sidebar"
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</FuseAnimate>
	);
}

export default SubscriptionsContent;
