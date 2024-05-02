import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const getAgentProfile = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/user/agent-profile/${requestOptions.urlParams.userId}`,
				params: requestOptions.params,
				cancelToken: requestOptions.cancelToken
			})
			// .then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getAgentProfiles = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/agent-profiles',
				params: requestOptions.params,
				cancelToken: requestOptions.cancelToken
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};
const getAgentProfileReferrals = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/user/agent-profile/referrals/${requestOptions.urlParams.userId}`,
				params: requestOptions.params,
				cancelToken: requestOptions.cancelToken
			})
			// .then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getAgentProfileReferralEarnings = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/user/agent-profile/referral-earnings/${requestOptions.urlParams.userId}`,
				params: requestOptions.params,
				cancelToken: requestOptions.cancelToken
			})
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

export { getAgentProfile, getAgentProfiles, getAgentProfileReferrals, getAgentProfileReferralEarnings };
