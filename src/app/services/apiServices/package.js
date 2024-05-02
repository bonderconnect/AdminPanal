import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const bindLearningMaterials = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/package/${requestOptions.urlParams.packageId}/bind-learning-materials`,
				data: requestOptions.data,
				method: 'POST'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const unbindLearningMaterials = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/package/${requestOptions.urlParams.packageId}/unbind-learning-materials`,
				data: requestOptions.data,
				method: 'POST'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

export { bindLearningMaterials, unbindLearningMaterials };
