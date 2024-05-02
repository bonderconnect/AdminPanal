import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import AdsTable from './AdsTable';
import {
	// 	openEditUserDialog,
	// 	openUserSubscriptionDialog,
	// 	removeUser,
	// 	selectUsers,
	// 	getUsers,
	// 	setUsersParams
	getAds
} from './store/adsSlice';

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

function AdsList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const adsContent = useSelector(state => state?.ads?.ads?.ads);
	// const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
	// const { params, count, loading } = useSelector(({ usersApp }) => usersApp.users);
	// const { params, count, loading } = useSelector(({ adsApp }) => adsApp.ads);

	// useDeepCompareEffect(() => {
	// 	// dispatch(getUsers(params));
	// }, [dispatch, params]);

	const goToPage = nextPageIndex => {
		// dispatch(setUsersParams({ ...params, page: nextPageIndex + 1 }));
	};

	const onRowsLimitChange = rowsLimit => {
		// dispatch(setUsersParams({ ...params, page: 1, limit: rowsLimit }));
	};

	const [tableData, setTableData] = useState([]);

	const [filteredData, setFilteredData] = useState(tableData);
	const handleImageUpload = (event, row) => {
		const newTableData = [...tableData];
		let assetData;
		// = (
		//   await launchImageLibrary({
		//     mediaType: 'photo',
		//   })
		// ).assets?.[0];

		if (assetData) {
			newTableData[row].image = {
				media_id: null,
				url: assetData.uri,
				priority: row + 1,
				mime_type: assetData.type,
				size_in_bytes: assetData.fileSize,
				file_name: assetData.fileName,
				file_key: null
			};
			setTableData(newTableData);
		}
	};

	const handleEnableChange = (event, row) => {
		const newTableData = [...tableData];
		newTableData[row].isEnabled = event.target.checked;
		setTableData(newTableData);
	};

	useEffect(() => {
		dispatch(getAds());
		setTableData(adsContent);
		console.log(`🚀  useEffect  tableData:`, tableData);
	}, [dispatch, getAds, tableData]);
	const columns = React.useMemo(
		() => [
			{
				Header: 'Enable',
				id: 'enable',
				accessor: 'isEnabled',
				Cell: ({ row }) => (
					<Checkbox checked={row.original.status} onChange={event => handleEnableChange(event, row.index)} />
				)
			},
			{
				Header: 'Image 1',
				id: 'image1',
				accessor: 'image1',
				Cell: ({ row }) => (
					<div>
						{row.original.images && (
							<img src={row.original.image1} alt="Preview" style={{ width: '100px', height: '100px' }} />
						)}
					</div>
				)
			},
			{
				Header: 'Image 2',
				id: 'image2',
				accessor: 'image2',
				Cell: ({ row }) => (
					<div>
						{row.original.images && (
							<img src={row.original.image2} alt="Preview" style={{ width: '100px', height: '100px' }} />
						)}
					</div>
				)
			},
			{
				Header: 'Image 3',
				id: 'image3',
				accessor: 'image3',
				Cell: ({ row }) => (
					<div>
						{row.original.images && (
							<img src={row.original.image3} alt="Preview" style={{ width: '100px', height: '100px' }} />
						)}
					</div>
				)
			}
		],
		[handleEnableChange, handleImageUpload]
	);

	// Will do the fiteration steps here
	// useEffect(() => {
	// 	setFilteredData(tableData);
	// }, [tableData]);

	// if (!filteredData) {
	// 	return null;
	// }

	// if (count === null && loading) {
	// 	return <FuseLoading />;
	// }

	// if (!loading && filteredData.length === 0) {
	// 	return (
	// 		<div className="flex flex-1 items-center justify-center h-full">
	// 			<Typography color="textSecondary" variant="h5">
	// 				There are no users!
	// 			</Typography>
	// 		</div>
	// 	);
	// }

	return (
		<AdsTable
			// loading={loading}
			columns={columns}
			data={tableData}
			goToPage={goToPage}
			onRowsLimitChange={onRowsLimitChange}
			// count={count}
			// pageIndex={params.page - 1}
			// limit={params.limit}
		/>
	);
}

export default AdsList;
