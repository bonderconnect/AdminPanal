import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SearchSelectUsers from './searchSelectUsers';
import SelectValidity from './selectValidity';
import { userRestrictionDialogAddUserSetSelection } from '../../store/videoDialogueSlice';

const TabAddUsers = () => {
	const dispatch = useDispatch();

	const { userRestrictionDialogue } = useSelector(({ videoApp }) => videoApp.videoDialogue);
	const { addUsersList } = userRestrictionDialogue;
	const { selection, selectionUserIds, activeStepIndex } = addUsersList;

	const handleUserToggle = userObject => {
		const selectionUpdated = (selection && { ...selection }) || { [userObject.id]: { user: userObject } };
		const selectionUserIdsUpdated = [...selectionUserIds];
		const userIdIndex = selectionUserIdsUpdated.indexOf(userObject.id);
		if (userIdIndex > -1) {
			delete selectionUpdated[userObject.id];
			selectionUserIdsUpdated.splice(userIdIndex, 1);
		} else {
			selectionUpdated[userObject.id] = { user: userObject };
			selectionUserIdsUpdated.push(userObject.id);
		}

		dispatch(userRestrictionDialogAddUserSetSelection({ selectionUpdated, selectionUserIdsUpdated }));
	};

	return (
		<>
			<div className="mt-12 mb-24 flex-1 flex">
				<em>{selectionUserIds.length} Users selected</em>
			</div>
			{(selection && Object.values(selection).length && (
				<div className="flex-1 flex flex-wrap mb-12">
					{Object.values(selection).map(item => (
						<Chip
							className="mb-6 mr-6"
							key={item.user.id}
							size="small"
							avatar={<Avatar alt="Natacha" src="assets/images/avatars/profile.jpg" />}
							label={item.user.name || `User ${item.user.id}`}
							onDelete={activeStepIndex === 0 ? () => handleUserToggle(item.user) : undefined}
						/>
					))}
				</div>
			)) ||
				null}
			{activeStepIndex === 0 ? (
				<SearchSelectUsers handleUserToggle={handleUserToggle} />
			) : (
				<SelectValidity selection={selection} />
			)}
		</>
	);
};

export default TabAddUsers;
