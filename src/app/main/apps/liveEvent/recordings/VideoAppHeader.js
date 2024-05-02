import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setVideosParams } from '../store/recordings/videosSlice';

function VideoAppHeader(props) {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState('');
	const mainTheme = useSelector(selectMainTheme);
	const { params } = useSelector(({ liveEventApp }) => liveEventApp.recordings.videos);

	const clearSearch = () => {
		setSearchText('');
		const updatedParams = { ...params };
		delete updatedParams.search;
		dispatch(setVideosParams({ ...updatedParams, page: 1 }));
	};
	const onSearchSubmit = ev => {
		ev.preventDefault();
		const updatedParams = { ...params, search: searchText };
		dispatch(setVideosParams({ ...updatedParams, page: 1 }));
	};

	return (
		<ThemeProvider theme={mainTheme}>
			<div className="flex flex-1">
				<Paper
					className="flex items-center w-full h-48 sm:h-56 p-16 ltr:pl-4 lg:ltr:pl-16 rtl:pr-4 lg:rtl:pr-16 rounded-8"
					elevation={1}
				>
					<Hidden lgUp>
						<IconButton
							onClick={ev => props.pageLayout.current.toggleLeftSidebar()}
							aria-label="open left sidebar"
						>
							<Icon>menu</Icon>
						</IconButton>
					</Hidden>

					<Icon color="action">search</Icon>
					<form className="flex flex-1" onSubmit={onSearchSubmit}>
						<Input
							placeholder="Search for recordings by title or description"
							className="px-16"
							disableUnderline
							fullWidth
							value={searchText}
							disabled={!!params.search}
							inputProps={{
								'aria-label': 'Search'
							}}
							endAdornment={
								<InputAdornment position="end">
									{searchText ? (
										<IconButton type="button" onClick={clearSearch}>
											<Icon className="text-20" color="action">
												clear
											</Icon>
										</IconButton>
									) : (
										<IconButton type="submit" disabled>
											<Icon className="text-20 opacity-50" color="action">
												search
											</Icon>
										</IconButton>
									)}
								</InputAdornment>
							}
							onChange={ev => setSearchText(ev.target.value)}
						/>
					</form>
				</Paper>
			</div>
		</ThemeProvider>
	);
}

export default VideoAppHeader;
