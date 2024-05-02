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
import ServicesTable from './ServicesTable';
import { selectServices, getServices, setParams } from '../store/services';
import { openEditServiceDialog } from '../store/serviceDialog';

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
	tableStrictWidthContent: {
		maxWidth: '155px',
		whiteSpace: 'break-spaces',
		wordWrap: 'break-word'
	},
	avatar: {
		width: 100,
		height: 100
	}
}));

function truncateText(text) {
	return helpers.truncate(text || '', { limit: 6, byWord: true, elipses: true });
}
function ServicesContent() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const services = useSelector(selectServices);
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	const { params, loading, meta } = useSelector(({ servicesApp }) => servicesApp.services);
	const count = meta.totalCount;

	useDeepCompareEffect(() => {
		dispatch(getServices(params));
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
								variant="square"
								className="mx-8"
								alt={row.original.name}
								src={
									row.original.image_file_key
										? helpers.getImageUrlByFileKey(row.original.image_file_key)
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
				Header: 'Name',
				sortable: false,
				Cell: ({ row }) => <div className={classes.tableStrictWidthContent}>{row.original.name}</div>
			},
			{
				Header: 'Description',
				sortable: false,
				Cell: ({ row }) => (
					<div className={classes.tableStrictWidthContent}>{truncateText(row.original.description)}</div>
				)
			},
			{
				Header: 'Address',
				sortable: false,
				Cell: ({ row }) => (
					<div className={classes.tableStrictWidthContent}>{truncateText(row.original.address)}</div>
				)
			},
			{
				Header: 'Contact number',
				sortable: false,
				Cell: ({ row }) => <div className={classes.tableStrictWidthContent}>{row.original.contact_number}</div>
			},
			{
				Header: 'Created on',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.created_on
							? moment(row.original.created_at).format('MMMM Do YYYY, h:mm a')
							: null}
					</div>
				)
			},
			{
				Header: 'Is published',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.status === 'active' ? (
							<Chip className={classes.statusActiveChip} size="small" label="Published" />
						) : null}
						{row.original.status === 'disabled' ? (
							<Chip className={classes.statusDisabledChip} size="small" label="Unpublished" />
						) : null}
					</div>
				)
			},
			{
				Header: 'Service meta details',
				id: 'service_meta_details',
				Cell: ({ row }) => <div className="flex flex-col justify-center" />
			},
			{
				Header: 'Company details',
				id: 'company_details',
				Cell: ({ row }) => (
					<div className="flex flex-col justify-center">
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Name:</span>
							<span className={classes.columnContentValue}>{row.original.company_name || null}</span>
						</div>
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Phone:</span>
							<span className={classes.columnContentValue}>{row.original.company_phone || null}</span>
						</div>
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Email:</span>
							<span className={classes.columnContentValue}>{row.original.company_email || null}</span>
						</div>
						<div className="mb-4">
							<span className={classes.columnContentLabel}>Address:</span>
							<span className={clsx(classes.columnContentValue, classes.tableStrictWidthContent)}>
								{row.original.company_address || null}
							</span>
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
									dispatch(openEditServiceDialog(row.original.created_user_id));
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
														Are you sure want to delete this service?
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
																// dispatch(removeUser(row.original.id));
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

	if (!services) {
		return null;
	}

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (!loading && services.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no services to show !
				</Typography>
			</div>
		);
	}

	return (
		<ServicesTable
			loading={loading}
			columns={columns}
			data={services}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			count={count}
			pageIndex={params.page - 1}
			limit={params.limit}
		/>
	);
}

export default ServicesContent;
