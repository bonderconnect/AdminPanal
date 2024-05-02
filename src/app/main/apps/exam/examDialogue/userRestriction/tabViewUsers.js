import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import {
	userRestrictionDialogSetUnsavedSelection,
	userRestrictionDialogSetPreviousSelection,
	userRestrictionDialogSetDeletedSelection
} from '../../store/examDialogueSlice';

const TabViewUsers = () => {
	const dispatch = useDispatch();

	const { userRestrictionDialogue } = useSelector(({ examApp }) => examApp.examDialogue);
	const {
		previousSelection,
		previousSelectionUserIds,
		unsavedSelection,
		unsavedSelectionUserIds,
		deletedSelection,
		deletedSelectionUserIds
	} = userRestrictionDialogue;

	const handleRemove = userId => {
		if (previousSelectionUserIds.indexOf(userId) > -1) {
			const updatedDeletedSelection = deletedSelection ? { ...deletedSelection } : {};
			const updatedDeletedSelectionUserIds = [...deletedSelectionUserIds];
			updatedDeletedSelectionUserIds.push(userId);
			updatedDeletedSelection[userId] = { ...previousSelection[userId] };
			dispatch(
				userRestrictionDialogSetDeletedSelection({
					deletedSelection: updatedDeletedSelection,
					deletedSelectionUserIds: updatedDeletedSelectionUserIds
				})
			);

			const index = previousSelectionUserIds.indexOf(userId);
			const updatedPreviousSelectionUserIds = [...previousSelectionUserIds];
			updatedPreviousSelectionUserIds.splice(index, 1);
			const updatedPreviousSelection = { ...previousSelection };
			delete updatedPreviousSelection[userId];
			dispatch(
				userRestrictionDialogSetPreviousSelection({
					previousSelection: updatedPreviousSelection,
					previousSelectionUserIds: updatedPreviousSelectionUserIds
				})
			);
		} else if (unsavedSelectionUserIds.indexOf(userId) > -1) {
			const index = unsavedSelectionUserIds.indexOf(userId);
			const updatedUnsavedSelectionUserIds = [...unsavedSelectionUserIds];
			updatedUnsavedSelectionUserIds.splice(index, 1);
			const updatedUnsavedSelection = { ...unsavedSelection };
			delete updatedUnsavedSelection[userId];
			dispatch(
				userRestrictionDialogSetUnsavedSelection({
					unsavedSelection: updatedUnsavedSelection,
					unsavedSelectionUserIds: updatedUnsavedSelectionUserIds
				})
			);
		}
	};

	return (
		<>
			<div className="mt-12 mb-24 flex-1 flex">
				<em>{previousSelectionUserIds.length + unsavedSelectionUserIds.length} Users selected</em>
			</div>
			<List>
				{previousSelection
					? Object.keys(previousSelection).map(userId => {
							const selection = previousSelection[userId];
							const listItem = selection.user;
							const labelId = `checkbox-list-label-${listItem.id}`;
							return (
								<ListItem className="mb-12" key={listItem.id} role={undefined} dense>
									<ListItemText
										id={labelId}
										primary={<>{listItem.name || <em>{`User ${listItem.id}`}</em>}</>}
										secondary={
											<div className="flex flex-1 flex-col">
												<Typography component="span" variant="body2" color="textSecondary">
													{listItem.email}
												</Typography>
												{selection.validFrom || selection.validTo ? (
													<div className="flex flex-col flex-1 mt-4">
														{selection.validFrom ? (
															<Typography
																color="textPrimary"
																variant="caption"
																display="block"
															>
																Valid from :
																{moment(selection.validFromDate).format(
																	'MMM Do YYYY, h:mm a'
																)}
															</Typography>
														) : null}
														{selection.validTo ? (
															<Typography
																color="textPrimary"
																variant="caption"
																display="block"
															>
																Valid to :
																{moment(selection.validToDate).format(
																	'MMM Do YYYY, h:mm a'
																)}
															</Typography>
														) : null}
													</div>
												) : null}
											</div>
										}
									/>
									<ListItemSecondaryAction>
										<IconButton onClick={() => handleRemove(listItem.id)} aria-label="delete">
											<ClearIcon fontSize="inherit" />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
					  })
					: null}
				{unsavedSelection
					? Object.keys(unsavedSelection).map(userId => {
							const selection = unsavedSelection[userId];
							const listItem = selection.user;
							const labelId = `checkbox-list-label-${listItem.id}`;
							return (
								<ListItem className="mb-12" key={listItem.id} role={undefined} dense>
									<ListItemText
										id={labelId}
										primary={<>{listItem.name || <em>{`User ${listItem.id}`}</em>}</>}
										secondary={
											<div className="flex flex-1 flex-col">
												<Typography component="span" variant="body2" color="textSecondary">
													{listItem.email}
												</Typography>
												{selection.validFrom || selection.validTo ? (
													<div className="flex flex-col flex-1 mt-4">
														{selection.validFrom ? (
															<Typography
																color="textPrimary"
																variant="caption"
																display="block"
															>
																Valid from :
																{moment(selection.validFromDate).format(
																	'MMM Do YYYY, h:mm a'
																)}
															</Typography>
														) : null}
														{selection.validTo ? (
															<Typography
																color="textPrimary"
																variant="caption"
																display="block"
															>
																Valid to :
																{moment(selection.validToDate).format(
																	'MMM Do YYYY, h:mm a'
																)}
															</Typography>
														) : null}
													</div>
												) : null}
											</div>
										}
									/>
									<ListItemSecondaryAction>
										<IconButton onClick={() => handleRemove(listItem.id)} aria-label="delete">
											<ClearIcon fontSize="inherit" />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
					  })
					: null}
			</List>
		</>
	);
};

export default TabViewUsers;
