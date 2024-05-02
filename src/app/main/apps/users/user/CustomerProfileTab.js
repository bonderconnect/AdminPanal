import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import moment from 'moment';

const CustomerProfileTab = () => {
	// const customerProfile = useSelector(state => state.usersApp.customerProfile.data.customer_profile);
	// const customerProfile = useSelector(state => state.usersApp.customerProfile?.data?.customer_profile);

	const customerProfile = {
		status: 'success',
		data: {
			customer_profile: {
				user_id: 174,
				created_on: '2023-09-08T11:08:37.501Z',
				email: 'joelmulammoottil994@gmail.com',
				name: 'Joel',
				meta: {
					location_coordinates: {
						latitude: 40.7128,
						longitude: -74.006
					}
				},
				image_file_key: 's05fOZwFh.jpeg'
			}
		}
	};

	return customerProfile ? (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Card className="w-full mb-32 rounded-16 shadow">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
								Customer Profile
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Name</Typography>
							<Typography>{customerProfile.name}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Email</Typography>
							<Typography>{customerProfile.email}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">User ID</Typography>
							<Typography>{customerProfile.user_id}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Created On</Typography>
							<Typography>{moment(customerProfile.created_on).format('MMMM Do YYYY, h:mm a')}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Location Coordinates</Typography>
							<Typography>{JSON.stringify(customerProfile?.meta?.location_coordinates)}</Typography>
						</div>

						{/* You can add more fields from the customer profile object as needed */}
					</CardContent>
				</Card>
			</div>
		</div>
	) : (
		<Card className="w-full mb-32 rounded-16 shadow">
			<AppBar position="static" elevation={0}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
						Customer Profile
					</Typography>
				</Toolbar>
			</AppBar>

			<CardContent>
				<div className="mb-24">
					<Typography className="font-semibold mb-4 text-15">No Customers</Typography>
				</div>

				{/* You can add more fields from the customer profile object as needed */}
			</CardContent>
		</Card>
	);
};

// eslint-disable-next-line import/prefer-default-export
export { CustomerProfileTab };
