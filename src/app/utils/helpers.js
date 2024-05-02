import _ from 'lodash';

const parseApiResponse = (axiosResponse, options) => {
	let data;
	let error;

	const response = axiosResponse.status !== 200 ? axiosResponse.response || {} : axiosResponse;

	if (response.data && response.data.data && options && options.returnArray) {
		if (!response.data.data.length) {
			data = [];
		} else if (Array.isArray(response.data.data)) {
			data = response.data.data;
		} else {
			data = [response.data.data];
		}
	} else if (response.data && response.data.data && response.data.data.length && response.data.data.length === 1) {
		[data] = response.data.data;
	} else if (response.data && response.data.data && response.data.data.length && response.data.data.length) {
		data = response.data.data;
	}

	if (response.data && response.data.info && options && options.returnArray) {
		if (!response.data.info.length) {
			error = [];
		} else if (Array.isArray(response.data.info)) {
			error = response.data.info;
		} else {
			error = [response.data.info];
		}
	} else if (response.data && response.data.info && response.data.info.length && response.data.info.length === 1) {
		[error] = response.data.info;
	} else if (response.data && response.data.info && response.data.info.length && response.data.info.length) {
		error = response.data.info;
	}

	const { status } = response;

	return {
		data,
		error,
		status
	};
};

const parseApiResponseV2 = (axiosResponse, options) => {
	const response = axiosResponse.status !== 200 ? axiosResponse.response || {} : axiosResponse;
	return response.data;
};

/** check a role is exist in user_role, ( both String and Array ) */
const checkUserRoleExist = (role, userRole) => {
	if (Array.isArray(userRole)) {
		return userRole.indexOf(role) !== -1;
	}
	if (userRole) {
		const userRoleSplitted = userRole.split(',');
		return userRoleSplitted.indexOf(role) !== -1;
	}
	return false;
};

const getUserRoleArray = userRole => {
	if (Array.isArray(userRole)) {
		return userRole;
	}
	if (userRole) {
		return userRole.split(',');
	}
	return [];
};

const userStatusSelectOptions = [
	{ value: 0, label: 'pending' },
	{ value: 1, label: 'active' },
	{ value: 2, label: 'disabled' }
];

function truncate(text, { limit, offset, byWord, elipses = true }) {
	let truncatedText;
	if (byWord) {
		const textSplitted = text.split(' ');
		if (textSplitted.length > (offset || limit)) {
			truncatedText = `${textSplitted.slice(0, limit).join(' ')}${elipses && ' ...'}`;
		} else {
			truncatedText = text;
		}
	} else {
		truncatedText = _.truncate(text.replace(/<(?:.|\n)*?>/gm, ''), {
			length: limit
		});
	}
	return truncatedText;
}

function CustomEvent(targetType, targetValue, targetName) {
	this.target = { type: targetType, value: targetValue, name: targetName };
}

CustomEvent.prototype.persist = function persist() {};

const trimCkeditorValue = value =>
	value
		? value
				.replace(/&nbsp;/g, ' ')
				.replace(/&amp;/g, '&')
				.replace(/(<([^>]+)>)/gi, '')
		: '';

function getImageUrlByFileKey(fileKey, location = 'uploads') {
	let bucketKey = 'system.uploads_cloud_bucket';
	let bucketRegionKey = 'system.uploads_cloud_bucket_region';

	if (location === 'general') {
		bucketKey = 'system.general_cloud_bucket';
		bucketRegionKey = 'system.general_cloud_bucket_region';
	}

	return fileKey
		? `https://s3.${window.config[bucketRegionKey]}.amazonaws.com/${window.config[bucketKey]}/${fileKey}`
		: null;
}

// export const uploadProductImageToS3AndCreateMedia = createAsyncThunk(
// 	'app/uploadProductImageToS3AndCreateMedia',
// 	async (payload, { getState, dispatch }) => {
// 		try {
// 			const imageUploadS3PresignedUrl = await axios.get(
// 				payload.general ? '/image-upload-s3-presigned-url' : '/product/image-upload-s3-presigned-url'
// 			);

// 			const imageUploadS3PresignedUrlData = imageUploadS3PresignedUrl?.data?.data;

// 			const fileUploadPayload = new FormData();
// 			let fileKey;
// 			Object.keys(imageUploadS3PresignedUrlData.fields).forEach(key => {
// 				fileUploadPayload.append(key, imageUploadS3PresignedUrlData.fields[key]);
// 				if (key === 'key') {
// 					fileKey = imageUploadS3PresignedUrlData.fields[key];
// 				}
// 			});
// 			fileUploadPayload.append('file', payload.file);

// 			await axiosNoAuth.request({
// 				url: imageUploadS3PresignedUrlData.url,
// 				method: 'post',
// 				data: fileUploadPayload,
// 				headers: { 'content-type': 'multipart/form-data' }
// 			});

// 			const mediaPayload = { ...payload, file_key: fileKey };
// 			delete mediaPayload.file;
// 			delete mediaPayload.media_id;
// 			delete mediaPayload.priority;
// 			delete mediaPayload.url;
// 			delete mediaPayload.uri;
// 			delete mediaPayload.general;
// 			const createMediaResponse = await axios.post('/media', mediaPayload);
// 			const createdMediaData = createMediaResponse?.data?.data;
// 			return {
// 				media_id: createdMediaData.media_id,
// 				priority: payload.priority
// 			};
// 		} catch (error) {
// 			throw error;
// 		}
// 	}
// );
export default {
	parseApiResponse,
	parseApiResponseV2,
	checkUserRoleExist,
	getUserRoleArray,
	userStatusSelectOptions,
	CustomEvent,
	trimCkeditorValue,
	getImageUrlByFileKey,
	truncate
};
