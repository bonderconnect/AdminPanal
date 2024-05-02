import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { openNewConstructionMaterialsCompanyDialog } from '../store/constructionMaterialsCompanyDialog';

function ConstructionMaterialsCompaniesHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);

	const handleNewConstructionMaterialsCompany = () => {
		dispatch(openNewConstructionMaterialsCompanyDialog());
	};

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-234">
				<div className="flex items-center">
					<Icon className="text-32">account_box</Icon>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						Construction company profiles
					</Typography>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-end px-8 sm:px-12">
				<Button
					onClick={handleNewConstructionMaterialsCompany}
					variant="contained"
					color="secondary"
					startIcon={<Icon>person_add</Icon>}
				>
					New Profile
				</Button>
			</div>
		</div>
	);
}

export default ConstructionMaterialsCompaniesHeader;
