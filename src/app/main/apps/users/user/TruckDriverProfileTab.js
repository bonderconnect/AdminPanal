import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, AppBar, Toolbar, Box, Grid, Avatar } from '@material-ui/core';

import moment from 'moment';

const TruckDriverProfile = () => {
	// const truckDriverProfile = useSelector(state => state.usersApp.truckDriverProfile?.data?.truck_driver_profile);
	// const serviceLocationLocality = useSelector(
	// 	state => state.usersApp.truckDriverProfile?.data?.service_location_locality
	// );
	const truckDriverProfile = {
		user_id: 60,
		vehicle_make_model_id: 1,
		vehicle_make_model_title: 'Tata Signa 4825.TK Tipper',
		vehicle_make_title: 'TATA',
		vehicle_make_id: 1,
		created_on: '2022-11-16T17:02:49.422Z',
		meta: null,
		owner_name: 'Vddg',
		vehicle_number: 'Gndg',
		name: 'Rgdvj',
		vehicle_capacity_in_ton: '45',
		vehicle_capacity_in_foot: '599',
		vehicle_capacity_in_number: '45',
		image_file_key: null
	};
	const serviceLocationLocality = [
		{
			service_location_locality_id: 3,
			truck_driver_profile_user_id: 60,
			service_location_district_id: 3,
			title: 'Chempanthara'
		},
		{
			service_location_locality_id: 8,
			truck_driver_profile_user_id: 60,
			service_location_district_id: 3,
			title: 'Kottukadu'
		},
		{
			service_location_locality_id: 10,
			truck_driver_profile_user_id: 60,
			service_location_district_id: 1,
			title: 'Kazhakkoottam'
		},
		{
			service_location_locality_id: 11,
			truck_driver_profile_user_id: 60,
			service_location_district_id: 1,
			title: 'Kaniyapuram'
		}
	];

	return (
		<Box sx={{ flexGrow: 1, overflow: 'hidden', p: 2, m: 2 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card>
						<AppBar position="static" elevation={0}>
							<Toolbar>
								<Typography variant="h6" color="inherit">
									Truck Driver Profile
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent>
							{truckDriverProfile ? (
								<>
									<Avatar alt={truckDriverProfile.name} src={truckDriverProfile.image_file_key} />
									<Typography variant="h5">{truckDriverProfile.name}</Typography>
									<Typography variant="body1">Email: {truckDriverProfile.email}</Typography>
									<Typography variant="body1">User ID: {truckDriverProfile.user_id}</Typography>
									<Typography variant="body1">
										Created On:{' '}
										{moment(truckDriverProfile.created_on).format('MMMM Do YYYY, h:mm a')}
									</Typography>
									<Typography variant="body1">
										Location Coordinates:{' '}
										{JSON.stringify(truckDriverProfile?.meta?.location_coordinates)}
									</Typography>
								</>
							) : (
								<Typography variant="h6">No Truck Driver Profile</Typography>
							)}

							{serviceLocationLocality && serviceLocationLocality.length > 0 ? (
								<>
									<Typography variant="h6">Service Locations</Typography>
									{serviceLocationLocality.map(location => (
										<Typography key={location.service_location_locality_id}>
											{location.title}
										</Typography>
									))}
								</>
							) : (
								<Typography variant="h6">No Service Locations</Typography>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TruckDriverProfile;
