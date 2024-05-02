import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

// Customer api
const getCustomer = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/user/customer-profile/${requestOptions.urlParams.userId}`
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

// eslint-disable-next-line import/prefer-default-export
export { getCustomer };
