import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const updateUserAccessControlType = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `learning-material/${requestOptions.urlParams.learningMaterialId}/user-access-control/type`,
				data: requestOptions.data,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const updateUserAccessControl = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `learning-material/${requestOptions.urlParams.learningMaterialId}/user-access-control`,
				data: requestOptions.data,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const deleteUserAccessControl = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `learning-material/${requestOptions.urlParams.learningMaterialId}/user-access-control`,
				data: requestOptions.data,
				method: 'DELETE'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getUserAccessControl = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `learning-material/${requestOptions.urlParams.learningMaterialId}/user-access-control`
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

export { updateUserAccessControlType, updateUserAccessControl, getUserAccessControl, deleteUserAccessControl };
