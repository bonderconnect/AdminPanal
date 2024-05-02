import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import moment from 'moment';

const DetailTab = () => {
	const video = useSelector(state => state.liveEventApp.recordings.video.detail.data);

	return video ? (
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
							<Typography className="font-semibold mb-4 text-15">Description</Typography>
							{video.description ? (
								<Typography>{video.description}</Typography>
							) : (
								<Typography className="text-gray-400">-NA-</Typography>
							)}
						</div>
						<div className="mb-24">
							<Typography className="font-semibold mb-4 text-15">Created on</Typography>
							<Typography>{moment(video.created_on).format('MMMM Do YYYY, h:mm a')}</Typography>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	) : null;
};

export default DetailTab;
