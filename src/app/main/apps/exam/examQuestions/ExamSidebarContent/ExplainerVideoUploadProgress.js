import React from 'react';
import LinearProgressWithLabel from 'app/fuse-layouts/shared-components/LinearProgressWithLabel';
import { useSelector } from 'react-redux';

const ExplainerVideoUploadProgress = () => {
	const uploadPercentage = useSelector(({ examApp }) => examApp.examQuestions.explainerVideo.upload.percentage);
	return <LinearProgressWithLabel progress={uploadPercentage} />;
};

export default ExplainerVideoUploadProgress;
