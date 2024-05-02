import React, { forwardRef } from 'react';
import { FileChooserFormsy } from '@fuse/core/formsy';
import { useSelector } from 'react-redux';

const FileChooser = forwardRef((props, ref) => {
	const uploadPercentage = useSelector(({ noteApp }) => noteApp.noteDialogue.upload.percentage);

	return <FileChooserFormsy {...props} uploadPercentage={uploadPercentage} fileRef={ref} />;
});

export default FileChooser;
