import React from 'react';
import { AppBar, Card, CardContent, Toolbar, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

export const ConstructionMaterialsProfileTab = () => {
	// const constructionMaterialsProfile = useSelector(state => state.usersApp.constructionMaterialsProfile?.data?.construction_materials_profile);
	const constructionMaterialsProfile = {
		construction_materials_company_profile_id: 23,
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
						Construction Materials Profile
					</Typography>
				</Toolbar>
			</AppBar>
			<CardContent>
				{constructionMaterialsProfile ? (
					<>
						{renderProfile('Company Name', constructionMaterialsProfile.company_name)}
						{renderProfile('Email', constructionMaterialsProfile.email)}
						{renderProfile('Address', constructionMaterialsProfile.address)}
						{renderProfile('Phone', constructionMaterialsProfile.phone)}
						{renderProfile('User ID', constructionMaterialsProfile.user_id)}
						{/* You can add more fields from the construction materials profile object as needed */}
					</>
				) : (
					renderProfile('No Construction Materials Profile', '')
				)}
			</CardContent>
		</Card>
	);
};
