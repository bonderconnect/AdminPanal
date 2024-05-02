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
import {
	getAgentProfileReferralEarnings,
	resetReferralEarnings
} from '../store/agent/AgentProfileReferralEarningsSlice';

export const AgentProfileReferralEarningsTab = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const { userId, section, subSection } = params;

	useEffect(() => {
		if (userId) {
			dispatch(getAgentProfileReferralEarnings(userId));
		}

		return () => {
			dispatch(resetReferralEarnings());
		};
	}, [userId, dispatch]);

	const agentProfileReferralEarnings = useSelector(
		state => state.agentsApp?.agent?.earnings?.data?.data?.agentProfileReferralEarnings
	);

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
						Agent Profile Referral Earnings
					</Typography>
				</Toolbar>
			</AppBar>
			<CardContent>
				{Array.isArray(agentProfileReferralEarnings) ? (
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Transaction ID</TableCell>
									<TableCell>Amount</TableCell>
									<TableCell>Title</TableCell>
									<TableCell>Customer Profile Name</TableCell>
									<TableCell>Truck Driver Profile Name</TableCell>
									<TableCell>Construction Materials Profile Name</TableCell>
									<TableCell>Service Profile Name</TableCell>
									<TableCell>Machinery Profile Name</TableCell>
									<TableCell>Created On</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{agentProfileReferralEarnings.map((earning, index) => (
									<TableRow key={index}>
										<TableCell>{earning.transaction_id}</TableCell>
										<TableCell>{earning.amount}</TableCell>
										<TableCell>{earning.title}</TableCell>
										<TableCell>{earning.customer_profile_name}</TableCell>
										<TableCell>{earning.truck_driver_profile_name}</TableCell>
										<TableCell>{earning.construction_materials_profile_name}</TableCell>
										<TableCell>{earning.service_profile_name}</TableCell>
										<TableCell>{earning.machinery_profile_name}</TableCell>
										<TableCell>{earning.created_on}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Typography className="font-semibold mb-4 text-15">No Agent Profile Referral Earnings</Typography>
				)}
			</CardContent>
		</Card>
	);
};
