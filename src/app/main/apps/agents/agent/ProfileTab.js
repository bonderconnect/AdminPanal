import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router';
import { getAgentProfileData, resetProfile } from '../store/agent/profileSlice';

const ProfileTab = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const { userId, section, subSection } = params;
	useEffect(() => {
		if (userId) {
			dispatch(getAgentProfileData(userId));
		}

		return () => {
			dispatch(resetProfile());
		};
	}, [userId, dispatch]);
	const agent = useSelector(state => state.agentsApp?.agent?.profile1?.data?.data?.agent_profile);
	return agent ? (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Card className="w-full mb-32 rounded-16 shadow">
					<AppBar position="static" elevation={0}>
						<Toolbar className="px-8">
							<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
								General Information
							</Typography>
							<Typography variant="h5" component="div">
								User ID: {agent.user_id}
							</Typography>
						</Toolbar>
					</AppBar>

					<CardContent>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Email</Typography>
							{agent.email ? (
								<Typography>{agent.email}</Typography>
							) : (
								<Typography className="text-gray-400">-NA-</Typography>
							)}
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Phone</Typography>
							{agent?.phone ? (
								<Typography>{agent?.phone}</Typography>
							) : (
								<Typography className="text-gray-400">-NA-</Typography>
							)}
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Onboarded / Joined</Typography>
							<Typography>{moment(agent?.created_on).format('MMMM Do YYYY, h:mm a')}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Created by</Typography>
							<Typography>{agent?.created_by ? 'Admin' : 'Self'}</Typography>
						</div>

						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Qualification</Typography>
							<Typography variant="body2"> {agent.qualification}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Date of Birth</Typography>
							<Typography variant="body2">{agent.date_of_birth}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Bank Account Number</Typography>
							<Typography variant="body2">{agent.bank_account_number}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">IFSC Code</Typography>
							<Typography variant="body2">{agent.ifsc_code}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Agent Code</Typography>
							<Typography variant="body2">{agent.agent_code}</Typography>
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Status</Typography>
							<Typography variant="body2">{agent.status}</Typography>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	) : null;
};

export default ProfileTab;
