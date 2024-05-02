import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const getVideosWatch = requestOptions =>
	axios.request({
		url: '/analytics/videos-watch',
		params: requestOptions.params
	});

const getExamAttempts = requestOptions =>
	axios.request({
		url: '/analytics/exams-attended',
		params: requestOptions.params
	});

// eslint-disable-next-line import/prefer-default-export
export { getVideosWatch, getExamAttempts };
