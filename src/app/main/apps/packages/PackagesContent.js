import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
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
import { setSelectedItem, selectPackages, openEditPackageDialog, deletePackage } from './store/packagesSlice';

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

function PackagesContent(props) {
	const dispatch = useDispatch();
	const packages = useSelector(selectPackages);
	const selectedItemId = useSelector(({ packagesApp }) => packagesApp.packages.selectedItemId);

	const classes = useStyles();

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<div className="flex px-16">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
							<TableCell>Title</TableCell>
							<TableCell className="hidden sm:table-cell">Description</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>

					<TableBody>
						{packages.map(item => {
							return (
								<TableRow
									key={item.id}
									hover
									onClick={() => dispatch(openEditPackageDialog(item))}
									selected={item.package_id === selectedItemId}
									className="cursor-pointer"
								>
									<TableCell className="max-w-64 w-64 p-0 text-center">
										<Icon className={clsx(classes.typeIcon, item.type)} />
									</TableCell>
									<TableCell>{item.package_title}</TableCell>
									<TableCell className="hidden sm:table-cell">
										{helpers.trimCkeditorValue(item.package_description)}
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
																	Are you sure want to delete this package?
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action irreversible. But you'll able to
																		retreive the package's data within 30 days by
																		contacting support team.
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
																			dispatch(deletePackage(item.package_id));
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

export default PackagesContent;
