import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setParams } from '../../store/video/watchLogs';

const Search = () => {
	const dispatch = useDispatch();
	const { params } = useSelector(state => state.videoApp.video.watchLogs);
	const [searchText, setSearchText] = useState('');
	const handleSearchTextChange = ev => {
		setSearchText(ev.target.value);
	};

	const handleSearchSubmit = ev => {
		ev.preventDefault();
		dispatch(setParams({ ...params, search: searchText }));
	};

	const onClearSearch = () => {
		setSearchText('');
		dispatch(setParams({ ...params, search: '' }));
	};

	return (
		<form onSubmit={handleSearchSubmit} className="flex">
			<TextField
				value={searchText}
				size="small"
				onChange={handleSearchTextChange}
				label="Search by user"
				variant="outlined"
			/>
			{params.search ? (
				<Button
					type="button"
					size="small"
					className="ml-8"
					disableElevation
					onClick={onClearSearch}
					variant="outlined"
					endIcon={<Icon>close</Icon>}
				>
					Clear
				</Button>
			) : (
				<Button
					type="submit"
					size="small"
					className="ml-8"
					disableElevation
					variant="outlined"
					endIcon={<Icon>search</Icon>}
				>
					Search
				</Button>
			)}
		</form>
	);
};

export default Search;
