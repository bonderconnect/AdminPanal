import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { getExamUserAttemptsExcelExportDownloadUrl, resetExcelExportDownloadUrl } from '../../store/exam/attempts';

const DownloadExcelReport = () => {
	const dispatch = useDispatch();
	const learningMaterialId = useSelector(state => state.examApp.exam.detail.data.learning_material_id);
	const downloadUrl = useSelector(state => state.examApp.exam.attempts.excelExport.downloadUrl);
	const downloadUrlLoading = useSelector(state => state.examApp.exam.attempts.excelExport.loading);

	const handleDownload = () => {
		dispatch(getExamUserAttemptsExcelExportDownloadUrl(learningMaterialId));
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
			Download report - all
		</Button>
	);
};

export default DownloadExcelReport;
