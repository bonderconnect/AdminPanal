import React from 'react';
import { AppBar, Card, CardContent, Toolbar, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

export const MachineryProfileTab = () => {
	// const machineryProfile = useSelector(state => state.usersApp.machineryProfile?.data?.machinery_profile);
	const machineryProfile = {
		machinery_company_profile_id: 15,
		email: '',
		address: '',
		user_id: 174,
		company_name: '',
		phone: '',
		image_file_key: null
	};
	const renderProfile = (label, value) => (
		<div className="mb-24">
			<Typography className="font-semibold mb-4 text-15">{label}</Typography>
			<Typography>{value}</Typography>
		</div>
	);

	return (
		<Card className="w-full mb-32 rounded-16 shadow">
			<AppBar position="static" elevation={0}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
						Machinery Profile
					</Typography>
				</Toolbar>
			</AppBar>
			<CardContent>
				{machineryProfile ? (
					<>
						{renderProfile('Company Name', machineryProfile.company_name)}
						{renderProfile('Email', machineryProfile.email)}
						{renderProfile('Address', machineryProfile.address)}
						{renderProfile('Phone', machineryProfile.phone)}
						{renderProfile('User ID', machineryProfile.user_id)}
						{/* You can add more fields from the machinery profile object as needed */}
					</>
				) : (
					renderProfile('No Machinery Profile', '')
				)}
			</CardContent>
		</Card>
	);
};
