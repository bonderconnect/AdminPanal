import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { getUsersExcelExportDownloadUrl, resetExcelExportDownloadUrl } from '../store/usersSlice';

const DownloadExcelReport = () => {
	const dispatch = useDispatch();
	const downloadUrl = useSelector(({ usersApp }) => usersApp.users.excelExport.downloadUrl);
	const downloadUrlLoading = useSelector(({ usersApp }) => usersApp.users.excelExport.loading);

	const handleDownload = () => {
		dispatch(getUsersExcelExportDownloadUrl());
	};

	useEffect(() => {
		if (downloadUrl) {
			window.open(downloadUrl, '_blank');
			dispatch(resetExcelExportDownloadUrl());
		}
	}, [downloadUrl]);

	return downloadUrlLoading ? (
		<Button type="button" size="small" className="ml-8" disableElevation disabled variant="outlined">
			generating. Please wait ...
		</Button>
	) : (
		<Button
			type="button"
			size="small"
			className="ml-8"
			disableElevation
			onClick={handleDownload}
			variant="outlined"
			endIcon={<Icon>get_app</Icon>}
		>
			Download Excel Export
		</Button>
	);
};

export default DownloadExcelReport;
