import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import List from '@material-ui/core/List';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { getNotes, selectNotes } from '../store/notesSlice';
import { openEditNoteDialog } from '../store/noteDialogueSlice';
import NoteListItem from './NoteListItem';

function NoteList(props) {
	const dispatch = useDispatch();
	const notes = useSelector(selectNotes);

	const { params, itemsStatusInChangeProgress, itemDuplicationInProgress, loading, count } = useSelector(
		({ noteApp }) => noteApp.notes
	);

	const { t } = useTranslation('noteApp');

	useDeepCompareEffect(() => {
		dispatch(getNotes(params));
	}, [dispatch, params]);

	const [filteredData, setFilteredData] = useState(null);

	// Will do the fiteration steps here
	useEffect(() => {
		setFilteredData(notes);
	}, [notes]);

	if (!filteredData) {
		return null;
	}

	const handleNoteItemSelect = materialId => {
		setTimeout(() => {
			dispatch(openEditNoteDialog(materialId));
		}, 0);
	};

	const openNoteLink = link => {
		window.open(link);
	};

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						{t('NO_NOTES')}
					</Typography>
				</div>
			</FuseAnimate>
		);
	}

	return (
		<List className="p-0">
			<>
				{filteredData.map(note => (
					<NoteListItem
						itemsStatusInChangeProgress={itemsStatusInChangeProgress}
						itemDuplicationInProgress={itemDuplicationInProgress}
						handleNoteItemSelect={handleNoteItemSelect}
						note={note}
						openNoteLink={openNoteLink}
						key={note.id}
					/>
				))}
			</>
		</List>
	);
}

export default withRouter(NoteList);
