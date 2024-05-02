import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ProfileTab = () => {
	const user = useSelector(state => state.usersApp.user.profile.data);
	return user ? (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Card className="w-full mb-32 rounded-16 shadow">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
								General Information
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Email</Typography>
							{user.email ? (
								<Typography>{user.email}</Typography>
							) : (
								<Typography className="text-gray-400">-NA-</Typography>
							)}
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Phone</Typography>
							{user.phone ? (
								<Typography>{user.phone}</Typography>
							) : (
								<Typography className="text-gray-400">-NA-</Typography>
							)}
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Onboarded / Joined</Typography>
							<Typography>{moment(user.created_on).format('MMMM Do YYYY, h:mm a')}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Created by</Typography>
							<Typography>{user.created_by ? 'Admin' : 'Self'}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Referred by</Typography>
							<Typography>{user.created_by ? 'Admin' : 'Self'}</Typography>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	) : null;
};

export default ProfileTab;
