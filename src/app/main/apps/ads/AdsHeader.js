import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setUsersParams, openNewUserDialog } from './store/adsSlice';
// import UsersFilterDropdown from './UsersFilterDropdown';

function AdsHeader(props) {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState('');
	const mainTheme = useSelector(selectMainTheme);
	// const { params } = useSelector(({ usersApp }) => usersApp.users);

	const clearSearch = () => {
		setSearchText('');
		// const updatedParams = { ...params };
		// delete updatedParams.search;
		// dispatch(setUsersParams({ ...updatedParams, page: 1 }));
	};
	const onSearchSubmit = ev => {
		ev.preventDefault();
		// const updatedParams = { ...params, search: searchText };
		// dispatch(setUsersParams({ ...updatedParams, page: 1 }));
	};

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-224">
				<div className="flex items-center">
					<Icon className="text-32">account_box</Icon>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						Ads
					</Typography>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-end px-8 sm:px-12">
				<div className="flex flex-1 items-center justify-start px-8 sm:px-12">
					<ThemeProvider theme={mainTheme}>
						<>
							<Paper
								className="flex p-4 mx-16 items-center w-full max-w-512 h-48 px-8 py-4 rounded-4"
								elevation={1}
							>
								<form className="flex flex-1" onSubmit={onSearchSubmit}>
									<Input
										placeholder="type email, phone or name and press enter"
										className="flex flex-1 pl-16 pr-4"
										disableUnderline
										fullWidth
										value={searchText}
										// disabled={!!params.search}
										inputProps={{
											'aria-label': 'Search'
										}}
										endAdornment={
											<InputAdornment position="end">
												{searchText ? (
													<Button onClick={clearSearch}>Clear</Button>
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
						</>
					</ThemeProvider>
					{/* <UsersFilterDropdown /> */}
				</div>

				<Button
					onClick={() => dispatch(openNewUserDialog())}
					variant="contained"
					color="secondary"
					startIcon={<Icon>person_add</Icon>}
				>
					New Ads
				</Button>
			</div>
		</div>
	);

	// return (
	// 	<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
	// 		<div className="flex flex-shrink items-center sm:w-224">
	// 			<Hidden lgUp>
	// 				<IconButton
	// 					onClick={ev => {
	// 						props.pageLayout.current.toggleLeftSidebar();
	// 					}}
	// 					aria-label="open left sidebar"
	// 				>
	// 					<Icon>menu</Icon>
	// 				</IconButton>
	// 			</Hidden>

	// 			<div className="flex items-center">
	// 				<Icon className="text-32">account_box</Icon>
	// 				<Typography variant="h6" className="mx-12 hidden sm:flex">
	// 					Users
	// 				</Typography>
	// 			</div>
	// 		</div>

	// 		<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
	// 			<ThemeProvider theme={mainTheme}>
	// 				<>
	// 					<Paper
	// 						className="flex p-4 items-center w-full max-w-512 h-48 px-8 py-4 rounded-8"
	// 						elevation={1}
	// 					>
	// 						<form className="flex flex-1" onSubmit={onSearchSubmit}>
	// 							<Input
	// 								placeholder="type email, phone or name and press enter"
	// 								className="flex flex-1 px-16"
	// 								disableUnderline
	// 								fullWidth
	// 								value={searchText}
	// 								disabled={!!params.search}
	// 								inputProps={{
	// 									'aria-label': 'Search'
	// 								}}
	// 								endAdornment={
	// 									<InputAdornment position="end">
	// 										{searchText ? (
	// 											<IconButton type="button" onClick={clearSearch}>
	// 												<Icon className="text-20" color="action">
	// 													clear
	// 												</Icon>
	// 											</IconButton>
	// 										) : (
	// 											<IconButton type="submit" disabled>
	// 												<Icon className="text-20 opacity-50" color="action">
	// 													search
	// 												</Icon>
	// 											</IconButton>
	// 										)}
	// 									</InputAdornment>
	// 								}
	// 								onChange={ev => setSearchText(ev.target.value)}
	// 							/>
	// 						</form>
	// 					</Paper>
	// 				</>
	// 			</ThemeProvider>
	// 		</div>
	// 	</div>
	// );
}

export default AdsHeader;
