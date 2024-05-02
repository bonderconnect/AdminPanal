import React, { useEffect } from 'react';
import {
	AppBar,
	Card,
	CardContent,
	Toolbar,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TableHead
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getAgentProfileReferrals, resetReferrals } from '../store/agent/AgentProfileReferralsSlice';

export const AgentProfileReferralsTab = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const { userId, section, subSection } = params;

	useEffect(() => {
		if (userId) {
			dispatch(getAgentProfileReferrals(userId));
		}

		return () => {
			dispatch(resetReferrals());
		};
	}, [userId, dispatch]);

	const agentProfileReferrals = useSelector(
		state => state.agentsApp?.agent?.referrals?.data?.data?.agentProfileReferrals
	);

	return (
		<Card className="w-full mb-32 rounded-16 shadow">
			<AppBar position="static" elevation={0}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
						Agent Profile Referrals
					</Typography>
				</Toolbar>
			</AppBar>
			<CardContent>
				{Array.isArray(agentProfileReferrals) ? (
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>User ID</TableCell>
									<TableCell>Customer Profile Name</TableCell>
									<TableCell>Customer Profile Created On</TableCell>
									<TableCell>Truck Driver Profile Name</TableCell>
									<TableCell>Truck Driver Profile Created On</TableCell>
									<TableCell>Construction Materials Profile Name</TableCell>
									<TableCell>Construction Materials Profile Created On</TableCell>
									<TableCell>Service Profile Name</TableCell>
									<TableCell>Service Profile Created On</TableCell>
									<TableCell>Machinery Profile Name</TableCell>
									<TableCell>Machinery Profile Created On</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{agentProfileReferrals.map((referral, index) => (
									<TableRow key={index}>
										<TableCell>{referral.user_id}</TableCell>
										<TableCell>{referral.customer_profile_name}</TableCell>
										<TableCell>{referral.customer_profile_created_on}</TableCell>
										<TableCell>{referral.truck_driver_profile_name}</TableCell>
										<TableCell>{referral.truck_driver_profile_created_on}</TableCell>
										<TableCell>{referral.construction_materials_profile_name}</TableCell>
										<TableCell>{referral.construction_materials_profile_created_on}</TableCell>
										<TableCell>{referral.service_profile_name}</TableCell>
										<TableCell>{referral.service_profile_created_on}</TableCell>
										<TableCell>{referral.machinery_profile_name}</TableCell>
										<TableCell>{referral.machinery_profile_created_on}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Typography className="font-semibold mb-4 text-15">No Agent Profile Referrals</Typography>
				)}
			</CardContent>
		</Card>
	);
};
