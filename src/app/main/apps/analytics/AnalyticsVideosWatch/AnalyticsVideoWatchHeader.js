import React from 'react';
import Icon from '@material-ui/core/Icon';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';

function AnalyticsVideosWatchHeader(props) {
	return (
		<div className="flex flex-col flex-1 p-8 sm:p-12 relative">
			<div className="flex flex-1 p-8 sm:p-24">
				<FuseAnimate delay={200}>
					<div className="flex items-center">
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Icon className="text-32">videocam</Icon>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography variant="h6" className="mx-12 hidden sm:flex">
								Videos Watch
							</Typography>
						</FuseAnimate>
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default AnalyticsVideosWatchHeader;
