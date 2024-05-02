import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { getExams, selectExams } from '../store/examsSlice';
import { openEditExamDialog } from '../store/examDialogueSlice';
import ExamsListItem from './ExamsListItem';

function ExamsList() {
	const dispatch = useDispatch();
	const exams = useSelector(selectExams);
	const history = useHistory();

	const { params, itemsStatusInChangeProgress, itemDuplicationInProgress, count, loading } = useSelector(
		({ examApp }) => examApp.exams
	);

	const { t } = useTranslation('examApp');

	useDeepCompareEffect(() => {
		dispatch(getExams(params));
	}, [dispatch, params]);

	const [filteredData, setFilteredData] = useState(null);

	// Will do the fiteration steps here
	useEffect(() => {
		setFilteredData(exams);
	}, [exams]);

	if (!filteredData) {
		return null;
	}

	const quickEditExam = learningMaterialId => {
		setTimeout(() => {
			dispatch(openEditExamDialog(learningMaterialId));
		}, 0);
	};

	const handleExamItemSelect = learningMaterialId => {
		setTimeout(() => {
			history.push(`/apps/material/exam/${learningMaterialId}/questions-management`);
		}, 0);
	};

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					{t('NO_EXAMS')}
				</Typography>
			</div>
		);
	}

	return (
		<List className="p-0">
			<>
				{filteredData.map(learningMaterial => (
					<ExamsListItem
						itemsStatusInChangeProgress={itemsStatusInChangeProgress}
						itemDuplicationInProgress={itemDuplicationInProgress}
						quickEditExam={quickEditExam}
						handleExamItemSelect={handleExamItemSelect}
						learningMaterial={learningMaterial}
						key={learningMaterial.learning_material_id}
					/>
				))}
			</>
		</List>
	);
}

export default withRouter(ExamsList);
