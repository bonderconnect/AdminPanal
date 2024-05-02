import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, AppBar, Toolbar } from '@material-ui/core';

const ServiceProfileTab = () => {
	// const serviceProfile = useSelector(state => state.usersApp.serviceProfile?.data?.service_profile);
	const serviceProfile = {
		service_company_profile_id: 39,
		email: '',
		address: '',
		user_id: 174,
		company_name: '',
		phone: '',
		image_file_key: null
	};

	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Card className="w-full mb-32 rounded-16 shadow">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
								Service Profile
							</Typography>
						</Toolbar>
					</AppBar>
					{serviceProfile ? (
						<CardContent>
							<Typography className="font-semibold mb-4 text-16">Company Name</Typography>
							<Typography>{serviceProfile.company_name}</Typography>

							<Typography className="font-semibold mb-4 text-16">Email</Typography>
							<Typography>{serviceProfile.email}</Typography>

							<Typography className="font-semibold mb-4 text-16">Phone</Typography>
							<Typography>{serviceProfile.phone}</Typography>

							<Typography className="font-semibold mb-4 text-16">Address</Typography>
							<Typography>{serviceProfile.address}</Typography>

							<Typography className="font-semibold mb-4 text-16">User ID</Typography>
							<Typography>{serviceProfile.user_id}</Typography>

							<Typography className="font-semibold mb-4 text-16">Service Company Profile ID</Typography>
							<Typography>{serviceProfile.service_company_profile_id}</Typography>
						</CardContent>
					) : (
						<CardContent>
							<Typography className="font-semibold mb-4 text-15">No Service Profile</Typography>
						</CardContent>
					)}
				</Card>
			</div>
		</div>
	);
};

export default ServiceProfileTab;
