import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import { setParams } from '../store/examsAttemptsSlice';

const AnalyticsExamsAttemptsContentSearch = () => {
	const params = useSelector(state => state.analyticsApp.examsAttempts.params);
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState('');

	const handleSearch = () => {
		const updatedParams = { ...params, search: searchText };
		dispatch(setParams(updatedParams));
	};

	const clearSearch = () => {
		setSearchText('');
		const updatedParams = { ...params, search: '' };
		dispatch(setParams(updatedParams));
	};

	return (
		<div className="flex items-center">
			<TextField
				onChange={ev => setSearchText(ev.target.value)}
				id="outlined-basic"
				label="Search by user"
				variant="outlined"
				value={searchText}
			/>
			{params.search ? (
				<Button
					onClick={clearSearch}
					size="large"
					className="ml-12"
					variant="contained"
					endIcon={<Icon>close</Icon>}
				>
					Clear
				</Button>
			) : null}
			{!params.search ? (
				<Button onClick={handleSearch} size="large" className="ml-12" variant="contained">
					Search
				</Button>
			) : null}
		</div>
	);
};

export default AnalyticsExamsAttemptsContentSearch;
