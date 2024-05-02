import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { TablePagination } from '@material-ui/core';
import { getVideos, selectVideos } from '../../store/recordings/videosSlice';
import { openEditVideoDialog } from '../../store/recordings/videoDialogueSlice';
import VideoListItem from './VideoListItem';

function VideoList(props) {
	const dispatch = useDispatch();
	const videos = useSelector(selectVideos);

	const { params, itemsStatusInChangeProgress, itemDuplicationInProgress, loading, count } = useSelector(
		({ liveEventApp }) => liveEventApp.recordings.videos
	);

	const { t } = useTranslation('liveEventApp/recordings');

	useDeepCompareEffect(() => {
		dispatch(getVideos(params));
	}, [dispatch, params]);

	const [filteredData, setFilteredData] = useState(null);

	// Will do the fiteration steps here
	useEffect(() => {
		setFilteredData(videos);
	}, [videos]);

	if (!filteredData) {
		return null;
	}

	const handleVideoItemSelect = materialId => {
		setTimeout(() => {
			dispatch(openEditVideoDialog(materialId));
		}, 0);
	};

	if (count === null && loading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						{t('NO_NOTES')}
					</Typography>
				</div>
			</FuseAnimate>
		);
	}

	return (
		<List className="p-0">
			<>
				{filteredData.map(video => (
					<VideoListItem
						itemsStatusInChangeProgress={itemsStatusInChangeProgress}
						itemDuplicationInProgress={itemDuplicationInProgress}
						handleVideoItemSelect={handleVideoItemSelect}
						video={video}
						key={video.id}
					/>
				))}
			</>
		</List>
	);
}

export default withRouter(VideoList);
