import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { userRestrictionSearchUsers } from '../../../store/recordings/videoDialogueSlice';

const useStyles = makeStyles(theme => ({
	searchContainer: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400
	},
	searchInput: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	searchIconButton: {
		padding: 10
	}
}));

const SearchSelectUsers = props => {
	const { handleUserToggle } = props;
	const dispatch = useDispatch();
	const classes = useStyles();
	const [searchText, setSearchText] = useState('');

	const { userRestrictionDialogue } = useSelector(({ liveEventApp }) => liveEventApp.recordings.videoDialogue);
	const { addUsersList, activeTabIndex } = userRestrictionDialogue;
	const { list, searchProgressing, listSearchText, selectionUserIds } = addUsersList;

	const handleSearchTextChange = ev => setSearchText(ev.target.value);

	useEffect(() => {
		if (searchText && searchText.length >= 3) {
			dispatch(userRestrictionSearchUsers(searchText));
		}
	}, [searchText]);

	return (
		<>
			<Paper square className={classes.searchContainer}>
				<InputBase
					className={classes.searchInput}
					placeholder="Search user"
					inputProps={{ 'aria-label': 'search user' }}
					onChange={handleSearchTextChange}
					value={searchText}
				/>
				<IconButton type="submit" className={classes.searchIconButton} aria-label="search">
					{searchProgressing && <CircularProgress size={24} />}
					{!searchProgressing && <SearchIcon />}
				</IconButton>
			</Paper>
			{searchProgressing && (
				<div className="mt-24 mb-12 flex-1 flex">
					<em className="text-grey">Searching users with name, email likely to '{searchText}'</em>
				</div>
			)}
			{!searchProgressing && (
				<div className="mt-24 mb-12 flex-1 flex">
					{list && list.length === 0 && searchText && searchText.length >= 3 && (
						<em className="text-grey">No users found likely to '{searchText}'</em>
					)}
					{list && list.length > 0 && searchText.length >= 3 && (
						<em>Users found likely to '{listSearchText}'</em>
					)}
					{(!list || searchText.length < 3) && (!searchText || searchText.length < 3) && (
						<em className="text-grey">Search users by name to add in the list ...</em>
					)}
				</div>
			)}
			{list && list.length > 0 && searchText.length >= 3 && (
				<List>
					{list.map(listItem => {
						const labelId = `checkbox-list-label-${listItem.id}`;
						return (
							<ListItem
								key={listItem.id}
								role={undefined}
								dense
								button
								onClick={() => handleUserToggle(listItem)}
							>
								<ListItemText
									id={labelId}
									primary={<>{listItem.name || <em>{`User ${listItem.id}`}</em>}</>}
									secondary={listItem.email}
								/>
								<ListItemSecondaryAction>
									<Checkbox
										checked={selectionUserIds.indexOf(listItem.id) > -1}
										tabIndex={-1}
										disableRipple
										onClick={e => {
											e.preventDefault();
											handleUserToggle(listItem);
										}}
										inputProps={{ 'aria-labelledby': labelId }}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>
			)}
		</>
	);
};

export default SearchSelectUsers;
