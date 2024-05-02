import React, { forwardRef } from 'react';
import { FileChooserFormsy } from '@fuse/core/formsy';
import { useSelector } from 'react-redux';

const FileChooser = forwardRef((props, ref) => {
	const uploadPercentage = useSelector(({ examApp }) => examApp.examDialogue.upload.percentage);

	return <FileChooserFormsy {...props} uploadPercentage={uploadPercentage} fileRef={ref} />;
});

export default FileChooser;
