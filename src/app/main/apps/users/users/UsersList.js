import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link as RouterLink } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import helpers from 'app/utils/helpers';
import { Chip } from '@material-ui/core';
import moment from 'moment';
import clsx from 'clsx';
import UsersTable from './UsersTable';
import {
	openEditUserDialog,
	openUserSubscriptionDialog,
	removeUser,
	selectUsers,
	getUsers,
	setUsersParams
} from '../store/usersSlice';

const useStyles = makeStyles(theme => ({
	rowActionButton: {
		fontSize: 10,
		padding: '6px 8px',
		margin: theme.spacing(0.5)
	},
	androidIcon: {
		width: 25
	},
	versionValue: {
		fontSize: 12,
		textAlign: 'center'
	},
	versionValueContainer: {
		width: 40
	},
	userRolesContainer: {
		width: 120
	},
	userRoleChip: {
		fontSize: 12,
		height: 22,
		fontWeight: '600'
	},
	statusDisabledChip: {
		color: '#959393',
		fontWeight: 'bold',
		fontSize: '16px'
	},
	statusActiveChip: {
		color: '#3ea356',
		fontWeight: 'bold',
		fontSize: '16px',
		backgroundColor: '#d9eee3'
	}
}));

function UsersList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const users = useSelector(selectUsers);
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	const { params, count, loading } = useSelector(({ usersApp }) => usersApp.users);

	useDeepCompareEffect(() => {
		dispatch(getUsers(params));
	}, [dispatch, params]);

	const goToPage = nextPageIndex => {
		dispatch(setUsersParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		dispatch(setUsersParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: () => null,
				accessor: 'avatar',
				Cell: ({ row }) => {
					return (
						<div className="flex items-center">
							{row.original.profile_picture_url ? (
								<Avatar
									className="mx-8"
									alt={row.original.name}
									src={row.original.profile_picture_url}
								/>
							) : (
								<Avatar className="mx-8" alt={row.original.name} />
							)}
						</div>
					);
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'User profiles',
				accessor: 'user_roles',
				Cell: ({ row }) => {
					const userProfilesLabels = [];
					if (row.original['customer_profile.user_id']) {
						userProfilesLabels.push('Customer');
					}
					if (row.original['construction_materials_company_profile.user_id']) {
						userProfilesLabels.push('Construction materials');
					}
					if (row.original['machinery_company_profile_id.user_id']) {
						userProfilesLabels.push('Machinery');
					}
					if (row.original['service_company_profile_id.user_id']) {
						userProfilesLabels.push('Service');
					}
					if (row.original['truck_driver_profile.user_id']) {
						userProfilesLabels.push('Truck driver');
					}
					if (row.original['agent_profile.user_id']) {
						userProfilesLabels.push('Agent');
					}

					return (
						<div className={clsx('flex', 'items-center', classes.userRolesContainer)}>
							<div className="flex flex-wrap mt-2">
								{userProfilesLabels.length ? (
									<>
										{userProfilesLabels.map(role => (
											<Chip
												className={clsx(classes.userRoleChip, 'my-2 mr-2')}
												size="small"
												label={role}
											/>
										))}
									</>
								) : null}
							</div>
						</div>
					);
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'App version',
				accessor: '',
				className: 'text-xs',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<img
							className={classes.androidIcon}
							alt="android"
							src="/assets/images/logos/os_android_icon.png"
						/>
						<div className={clsx('flex justify-center', classes.versionValueContainer)}>
							{typeof row.original.app_version === 'undefined' ? (
								<span className={classes.versionValue}>---</span>
							) : (
								<span className={classes.versionValue}>{row.original.app_version || '- NA -'}</span>
							)}
						</div>
					</div>
				)
			},
			{
				Header: 'Phone',
				accessor: 'phone',
				sortable: false
			},
			{
				Header: 'Onboarded date',
				accessor: 'created_on',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.created_on
							? moment(row.original.created_on).format('MMMM Do YYYY, h:mm a')
							: null}
					</div>
				)
			},
			{
				Header: 'Account status',
				accessor: 'status',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.status === 'active' ? (
							<Chip className={classes.statusActiveChip} size="small" label="Enabled" />
						) : null}
						{row.original.status === 'disabled' ? (
							<Chip className={classes.statusDisabledChip} size="small" label="Disabled" />
						) : null}
					</div>
				)
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center align-center justify-end">
						{!helpers.checkUserRoleExist('SUPER-ADMIN', row.original.user_role) && (
							<div className="flex items-center align-center">
								<Button
									variant="contained"
									color="primary"
									size="small"
									className={classes.rowActionButton}
									endIcon={<Icon>local_mall_icon</Icon>}
									onClick={ev => {
										ev.stopPropagation();
										dispatch(openUserSubscriptionDialog(row.original.id));
									}}
								>
									Subscriptions
								</Button>
								<Button
									onClick={ev => {
										ev.stopPropagation();
										// console.log('userList :: row', row.original.user_id);
									}}
									component={RouterLink}
									to={`/apps/users/user/${row.original.user_id}/profile`}
									variant="contained"
									size="small"
									color="primary"
									endIcon={<Icon>account_circle</Icon>}
									className={classes.rowActionButton}
								>
									Profile
								</Button>
								<Button
									onClick={ev => {
										ev.stopPropagation();
										const userId = row.original.user_id;
										dispatch(openEditUserDialog(userId));
									}}
									variant="contained"
									size="small"
									color="primary"
									startIcon={<Icon>edit</Icon>}
									className={classes.rowActionButton}
								>
									edit
								</Button>
								<IconButton
									onClick={ev => {
										ev.stopPropagation();
										dispatch(
											openDialog({
												children: (
													<>
														<DialogTitle id="alert-dialog-title">
															Are you sure want to delete this user?
														</DialogTitle>
														<DialogContent>
															<DialogContentText id="alert-dialog-description">
																This action irreversible. But you'll able to retreive
																the user's data within 30 days by contacting support
																team.
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
																	dispatch(removeUser(row.original.user_id));
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
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)}
					</div>
				)
			}
		],
		[dispatch]
	);

	// Will do the fiteration steps here
	useEffect(() => {
		setFilteredData(users);
	}, [users]);

	if (!filteredData) {
		return null;
	}

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (!loading && filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no users!
				</Typography>
			</div>
		);
	}

	return (
		<UsersTable
			loading={loading}
			columns={columns}
			data={filteredData}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			count={count}
			pageIndex={params.page - 1}
			limit={params.limit}
		/>
	);
}

export default UsersList;
