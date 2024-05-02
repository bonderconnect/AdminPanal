import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { openNewMachineryDialog } from '../store/machineryDialog';

function MachineriesHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);

	const handleNewMachinery = () => {
		dispatch(openNewMachineryDialog());
	};

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-234">
				<div className="flex items-center">
					<Icon className="text-32">account_box</Icon>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						Machinery products
					</Typography>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-end px-8 sm:px-12">
				<Button
					onClick={handleNewMachinery}
					variant="contained"
					color="secondary"
					startIcon={<Icon>person_add</Icon>}
				>
					New machinery
				</Button>
			</div>
		</div>
	);
}

export default MachineriesHeader;
