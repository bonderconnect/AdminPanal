import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
import { Link as RouterLink } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import helpers from 'app/utils/helpers';
import moment from 'moment';
import clsx from 'clsx';
import AgentsTable from './AgentsTable';
import { selectAgents, getAgents, setParams } from '../store/agents';
import { openEditAgentDialog } from '../store/agentDialog';
import { removeUser } from '../../users/store/usersSlice';

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
		fontSize: 8,
		height: 18,
		fontWeight: 'bold'
	},
	columnContentLabel: {
		fontSize: '12px',
		fontWeight: 'bold',
		marginRight: '8px'
	},
	columnContentValue: {
		fontSize: '14px',
		fontWeight: '400'
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
	},
	statusPendingChip: {
		color: '#dad70f',
		fontWeight: 'bold',
		fontSize: '16px',
		backgroundColor: '#d9eee3'
	},
	referralCode: {
		color: '#333333',
		fontWeight: 'bolder',
		fontSize: '20px',
		letterSpacing: '2px'
	}
}));

function AgentsContent() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const agents = useSelector(selectAgents);
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	const { params, loading, meta } = useSelector(({ agentsApp }) => agentsApp.agents);
	const count = meta.totalCount;

	useDeepCompareEffect(() => {
		dispatch(getAgents(params));
	}, [dispatch, params]);

	const goToPage = nextPageIndex => {
		dispatch(setParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		dispatch(setParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const columns = useMemo(
		() => [
			{
				Header: () => null,
				accessor: 'avatar',
				Cell: ({ row }) => {
					return (
						<div className="flex items-center">
							<Avatar
								className="mx-8"
								alt={row.original.name}
								src={
									row.original.file_key
										? helpers.getImageUrlByFileKey(row.original.file_key)
										: row.original.avatar
								}
							/>
						</div>
					);
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'Agent profile details',
				id: 'email_n_qualification_n_phone',
				Cell: ({ row }) => (
					<div className="flex flex-col justify-center">
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Qualification:</span>
							<span className={classes.columnContentValue}>{row.original.qualification || null}</span>
						</div>
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Phone:</span>
							<span className={classes.columnContentValue}>{row.original.phone || null}</span>
						</div>
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Email:</span>
							<span className={classes.columnContentValue}>{row.original.email || null}</span>
						</div>
					</div>
				)
			},
			{
				Header: "User's Phone",
				sortable: false,
				Cell: ({ row }) => row.original['user.phone']
			},
			{
				Header: 'Profile created on',
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
				Header: 'User onboarded on',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original['user.created_on']
							? moment(row.original['user.created_on']).format('MMMM Do YYYY, h:mm a')
							: null}
					</div>
				)
			},
			{
				Header: 'Profile status',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.status === 'active' ? (
							<Chip className={classes.statusActiveChip} size="small" label="Enabled" />
						) : null}
						{row.original.status === 'disabled' ? (
							<Chip className={classes.statusDisabledChip} size="small" label="Disabled" />
						) : null}
						{row.original.status === 'pending' ? (
							<Chip className={classes.statusPendingChip} size="small" label="Pending" />
						) : null}
					</div>
				)
			},
			{
				Header: 'Referral code',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<span className={classes.referralCode}>{row.original.agent_code}</span>
					</div>
				)
			},
			{
				Header: 'Bank account details',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex flex-col justify-center">
						<div className="mb-2">
							<span className={classes.columnContentLabel}>Account number:</span>
							<span className={classes.columnContentValue}>
								{row.original.bank_account_number || null}
							</span>
						</div>
						<div>
							<span className={classes.columnContentLabel}>IFSC code:</span>
							<span className={classes.columnContentValue}>{row.original.ifsc_code || null}</span>
						</div>
					</div>
				)
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-end justify-end">
						<div className="flex items-center align-center">
							<Button
								onClick={ev => {
									ev.stopPropagation();
								}}
								component={RouterLink}
								to={`/apps/users/user/${row.original['user.user_id']}/agent`}
								variant="contained"
								size="small"
								color="primary"
								startIcon={<Icon>face</Icon>}
								className={classes.rowActionButton}
							>
								view
							</Button>
							<Button
								onClick={ev => {
									ev.stopPropagation();
									dispatch(openEditAgentDialog(row.original['user.user_id'], row.original.status));
									console.log(row.original);
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
														Are you sure want to delete this agent?
													</DialogTitle>
													<DialogContent>
														<DialogContentText id="alert-dialog-description">
															This action irreversible. But you'll able to retreive the
															user's data within 30 days by contacting support team.
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button onClick={() => dispatch(closeDialog())} color="primary">
															Cancel
														</Button>
														<Button
															onClick={() => {
																dispatch(removeUser(row.original['user.user_id']));
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
					</div>
				)
			}
		],
		[dispatch]
	);

	if (!agents) {
		return null;
	}

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (!loading && agents.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no agents to show !
				</Typography>
			</div>
		);
	}

	return (
		<AgentsTable
			loading={loading}
			columns={columns}
			data={agents}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			count={count}
			pageIndex={params.page - 1}
			limit={params.limit}
		/>
	);
}

export default AgentsContent;
