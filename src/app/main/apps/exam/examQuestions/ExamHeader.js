import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setParams } from '../store/examQuestionsSlice';

function ExamHeader(props) {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState('');
	const mainTheme = useSelector(selectMainTheme);
	const { params } = useSelector(({ examApp }) => examApp.examQuestions);

	const { t } = useTranslation('examApp');

	const clearSearch = () => {
		setSearchText('');
		const updatedParams = { ...params };
		delete updatedParams.search;
		dispatch(setParams({ ...updatedParams, page: 1 }));
	};
	const onSearchSubmit = ev => {
		ev.preventDefault();
		const updatedParams = { ...params, search: searchText };
		dispatch(setParams({ ...updatedParams, page: 1 }));
	};

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-1 items-center">
				<Hidden lgUp>
					<IconButton
						onClick={ev => {
							props.pageLayout.current.toggleLeftSidebar();
						}}
						aria-label="open left sidebar"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>

				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">list_alt</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							{t('APP_TITLE_SINGLE')}
						</Typography>
					</FuseAnimate>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<>
							<Paper
								className="flex p-4 items-center w-full max-w-512 h-48 px-8 py-4 rounded-8"
								elevation={1}
							>
								<form className="flex flex-1" onSubmit={onSearchSubmit}>
									<Input
										placeholder={t('QUESTIONS_SEARCH_PLACEHOLDER')}
										className="flex flex-1 px-16"
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
						</>
					</FuseAnimate>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default ExamHeader;
