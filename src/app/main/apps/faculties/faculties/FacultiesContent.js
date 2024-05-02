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
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import helpers from 'app/utils/helpers';
import moment from 'moment';
import clsx from 'clsx';
import FacultiesTable from './FacultiesTable';
import { selectFaculties, getFaculties, setParams } from '../store/faculties';
import { openEditFacultyDialog } from '../store/facultyDialog';

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
	}
}));

function FacultiesContent() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const faculties = useSelector(selectFaculties);
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	const { params, loading, meta } = useSelector(({ facultiesApp }) => facultiesApp.faculties);
	const count = meta.totalCount;

	useDeepCompareEffect(() => {
		dispatch(getFaculties(params));
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
							<Avatar className="mx-8" alt={row.original.name} src={row.original.avatar} />
						</div>
					);
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'Display name',
				accessor: 'name',
				className: 'font-bold',
				sortable: false
			},
			{
				Header: 'Email',
				accessor: 'email',
				sortable: false
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
				accessor: 'status_value',
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{{ 0: 'Suspended / Inactive', 1: 'Active' }[row.original.status_value]}
					</div>
				)
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-end justify-end">
						{!helpers.checkUserRoleExist('SUPER-ADMIN', row.original.user_role) && (
							<div className="flex items-center align-center">
								<Button
									onClick={ev => {
										ev.stopPropagation();
									}}
									component={RouterLink}
									to={`/apps/users/user/${row.original.id}/profile`}
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
										dispatch(openEditFacultyDialog(row.original.id));
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
															Are you sure want to delete this student?
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
						)}
					</div>
				)
			}
		],
		[dispatch]
	);

	if (!faculties) {
		return null;
	}

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (!loading && faculties.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no faculties to show !
				</Typography>
			</div>
		);
	}

	return (
		<FacultiesTable
			loading={loading}
			columns={columns}
			data={faculties}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			count={count}
			pageIndex={params.page - 1}
			limit={params.limit}
		/>
	);
}

export default FacultiesContent;
