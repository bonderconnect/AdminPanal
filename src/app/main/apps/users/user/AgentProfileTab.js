import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const AgentProfileTab = () => {
	// const agentProfiles = useSelector(state => state.usersApp.agentProfiles?.data?.agentProfiles);
	const agentProfiles = [
		{
			'user.user_id': 171,
			'user.phone': '9645687470',
			'user.created_on': '2023-07-26T09:15:03.214Z',
			'agent_profile.user_id': 171,
			qualification: 'Degree',
			date_of_birth: '2000-01-01',
			phone: '',
			email: 'Test@test.com',
			bank_account_number: '123456789123',
			ifsc_code: 'TEST',
			agent_code: 'D12390',
			status: 'disabled',
			created_on: '2023-08-03T06:37:34.033Z'
		},
		{
			'user.user_id': 170,
			'user.phone': '9633720343',
			'user.created_on': '2023-07-19T11:03:57.353Z',
			'agent_profile.user_id': 170,
			qualification: 'Aa',
			date_of_birth: '2023-08-07',
			phone: '',
			email: '',
			bank_account_number: '',
			ifsc_code: '',
			agent_code: 'P13599',
			status: 'disabled',
			created_on: '2023-08-07T06:54:14.548Z'
		},
		{
			'user.user_id': 165,
			'user.phone': '8086699702',
			'user.created_on': '2023-06-16T03:17:14.220Z',
			'agent_profile.user_id': 165,
			qualification: 'Degree',
			date_of_birth: '1992-11-15',
			phone: '8086699020',
			email: 'arunwilson@mailinator.com',
			bank_account_number: '5678012349',
			ifsc_code: 'KLMN0567801',
			agent_code: 'T10610',
			status: 'disabled',
			created_on: '2023-06-17T10:49:59.911Z'
		},
		{
			'user.user_id': 164,
			'user.phone': null,
			'user.created_on': '2023-06-11T07:31:47.141Z',
			'agent_profile.user_id': 164,
			qualification: "Bachelor's in Computer science",
			date_of_birth: '1992-11-11',
			phone: '9745544915',
			email: 'zephyr.lefay@enigma.net',
			bank_account_number: '219012211122',
			ifsc_code: 'IBN909112',
			agent_code: 'Y11319',
			status: 'disabled',
			created_on: '2023-06-19T13:24:46.728Z'
		},
		{
			'user.user_id': 75,
			'user.phone': '6956565326',
			'user.created_on': '2023-01-02T17:25:20.751Z',
			'agent_profile.user_id': 75,
			qualification: 'Degree',
			date_of_birth: '2007-01-26',
			phone: '2656665669',
			email: 'madisonmadi@mailinator.com',
			bank_account_number: '7654321098',
			ifsc_code: 'CDEF0765432',
			agent_code: 'Q85015',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		},
		{
			'user.user_id': 72,
			'user.phone': '8593000399',
			'user.created_on': '2022-12-21T08:34:20.021Z',
			'agent_profile.user_id': 72,
			qualification: 'Degree',
			date_of_birth: '1991-01-03',
			phone: '8593000399',
			email: 'bensonben@mailinator.com',
			bank_account_number: '3147209865',
			ifsc_code: 'GHIJ0314720',
			agent_code: 'M97263',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		},
		{
			'user.user_id': 71,
			'user.phone': '9544417781',
			'user.created_on': '2022-11-27T13:46:29.007Z',
			'agent_profile.user_id': 71,
			qualification: 'Degree',
			date_of_birth: '1995-08-10',
			phone: '9544414481',
			email: 'ericksonerick@mailinator.com',
			bank_account_number: '1029384756',
			ifsc_code: 'YZAB0102938',
			agent_code: 'M72799',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		},
		{
			'user.user_id': 31,
			'user.phone': '9544855555',
			'user.created_on': '2022-11-14T02:36:34.068Z',
			'agent_profile.user_id': 31,
			qualification: 'Degree',
			date_of_birth: '2022-11-11',
			phone: '9098877654',
			email: 'loidsonloid@mailinator.com',
			bank_account_number: '5793102468',
			ifsc_code: 'UVWX0579310',
			agent_code: 'V65274',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		},
		{
			'user.user_id': 30,
			'user.phone': '2555455455',
			'user.created_on': '2022-11-13T16:14:58.282Z',
			'agent_profile.user_id': 30,
			qualification: 'Degree',
			date_of_birth: '2006-11-03',
			phone: '4556656790',
			email: 'pearsonpear@mailinator.com',
			bank_account_number: '8642097531',
			ifsc_code: 'QRST0864209',
			agent_code: 'O52307',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		},
		{
			'user.user_id': 29,
			'user.phone': '9565663656',
			'user.created_on': '2022-11-13T15:55:15.264Z',
			'agent_profile.user_id': 29,
			qualification: 'Degree',
			date_of_birth: '2022-11-02',
			phone: '9098899898',
			email: 'mansonman@mailinator.com',
			bank_account_number: '1357924680',
			ifsc_code: 'MNOP0135792',
			agent_code: 'U47345',
			status: 'disabled',
			created_on: '2023-06-16T03:26:38.533Z'
		}
	];

	if (!agentProfiles || agentProfiles.length === 0) {
		return <Typography variant="h6">No data available</Typography>;
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>User ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Created On</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{agentProfiles.map(profile => (
						<TableRow key={profile['user.user_id']}>
							<TableCell>{profile['user.user_id']}</TableCell>
							<TableCell>{profile['user.name']}</TableCell>
							<TableCell>{profile['user.email']}</TableCell>
							<TableCell>{profile['user.phone']}</TableCell>
							<TableCell>{new Date(profile['user.created_on']).toLocaleString()}</TableCell>
							<TableCell>{profile.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AgentProfileTab;
