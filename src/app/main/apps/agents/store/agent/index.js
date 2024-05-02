import { combineReducers } from '@reduxjs/toolkit';
import profile1 from './profileSlice';
import analytics from './analytics';
import referrals from './AgentProfileReferralsSlice';
import earnings from './AgentProfileReferralEarningsSlice';

const reducer = combineReducers({
	profile1,
	analytics,
	referrals,
	earnings
});

export default reducer;
