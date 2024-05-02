import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const getUsers = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/users',
				params: requestOptions.params,
				cancelToken: requestOptions.cancelToken
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getUsersCount = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/users/count',
				requestOptions
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getUsersLatestAppVersionAgainstUserIds = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: 'users/get-latest-appversion-against-userids',
				method: 'POST',
				data: requestOptions.data
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getUser = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/user/${requestOptions.urlParams.userId}`
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getUserExamAttended = requestOptions =>
	axios.request({
		url: `/user/${requestOptions.urlParams.userId}/exams-attended`,
		params: requestOptions.params
	});

const getUserVideoWatchLogs = requestOptions =>
	axios.request({
		url: `/user/${requestOptions.urlParams.userId}/video-watch-logs`,
		params: requestOptions.params
	});

const getUserDistinctVideoWatchCount = requestOptions =>
	axios.request({
		url: `/user/${requestOptions.urlParams.userId}/distinct-video-watch-count`,
		params: requestOptions.params
	});

const getUsersExcelExportDownloadUrl = requestOptions =>
	axios.request({
		url: '/users/excel-export',
		params: requestOptions.params
	});

export {
	getUsers,
	getUsersCount,
	getUsersLatestAppVersionAgainstUserIds,
	getUser,
	getUserExamAttended,
	getUserVideoWatchLogs,
	getUserDistinctVideoWatchCount,
	getUsersExcelExportDownloadUrl
};
