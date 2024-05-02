import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const getVideo = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/video/${requestOptions.urlParams.learningMaterialId}`
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getVideoWatchLogsOfAllUsers = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/video/watch-logs-of-all-users`,
		params: requestOptions.params
	});

export { getVideo, getVideoWatchLogsOfAllUsers };
