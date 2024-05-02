import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getSubscriptions = createAsyncThunk(
	'subscriptionsApp/subscriptions/getSubscriptions',
	async (_, { dispatch, getState }) => {
		dispatch(getSubscriptionsCount());
		const { params } = getState().subscriptionsApp.subscriptions;
		const response = await axios
			.get('/subscriptions', { params })
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
		const { data } = response;

		return data;
	}
);

export const getSubscriptionsCount = createAsyncThunk(
	'subscriptionsApp/subscriptions/getSubscriptionsCount',
	async (
		_
		// { getState }
	) => {
		// const { params } = getState().subscriptionsApp.subscriptions;
		const response = await axios.get('/subscriptions/count').then(helpers.parseApiResponse);
		const { data } = response;

		return data;
	}
);

export const addSubscription = createAsyncThunk(
	'subscriptionsApp/subscriptions/addSubscription',
	async (payload, { dispatch, getState }) => {
		const { subscription } = payload;
		const createSubscriptionPayload = {
			entity_id: subscription.entity_id,
			entity_type_value: subscription.entity_type_value,
			subscription_duration: subscription.subscription_duration,
			current_price: subscription.current_price,
			initial_price: subscription.initial_price,
			serving_priority: subscription.serving_priority
		};
		return axios
			.post('/subscription', createSubscriptionPayload)
			.then(helpers.parseApiResponse)
			.then(
				response => response.data.subscription_id,
				() => {
					dispatch(showMessage({ message: 'Subscription added failed' }));
					return Promise.reject(new Error('Subscription added failed'));
				}
			)
			.then(subscriptionId =>
				subscription.status_value ? axios.patch(`/subscription/${subscriptionId}/publish`) : Promise.resolve()
			)
			.then(() => {
				dispatch(getSubscriptions());
				dispatch(showMessage({ message: 'Subscription added successfully' }));
			})
			.finally(() => {
				if (payload.closeNewPackageDialog) {
					dispatch(closeNewSubscriptionDialog());
				}
			});
	}
);

export const deleteSubscription = createAsyncThunk(
	'subscriptionsApp/subscriptions/deleteSubscription',
	async (subscriptionId, { dispatch }) => {
		return axios
			.delete(`/subscription/${subscriptionId}`)
			.then(helpers.parseApiResponse, helpers.parseApiResponse)
			.then(result => {
				if (result.error) {
					dispatch(showMessage({ message: result.error }));
				} else {
					dispatch(showMessage({ message: 'Subscription deleted successfully' }));
				}
			})
			.finally(() => dispatch(getSubscriptions()));
	}
);

export const updateSubscription = createAsyncThunk(
	'subscriptionsApp/subscriptions/updateSubscription',
	async (payload, { dispatch, getState }) => {
		const { subscription, subscriptionId } = payload;

		const updateSubscriptionPayload = {
			entity_id: subscription.entity_id,
			entity_type_value: subscription.entity_type_value,
			subscription_duration: subscription.subscription_duration,
			current_price: subscription.current_price,
			initial_price: subscription.initial_price,
			serving_priority: subscription.serving_priority
		};
		return axios
			.patch(`/subscription/${subscriptionId}`, updateSubscriptionPayload)
			.then(helpers.parseApiResponse, () => {
				dispatch(showMessage({ message: 'Subscription updation failed' }));
				return Promise.reject(new Error('Subscription updation failed'));
			})
			.then(() => {
				const state = getState();
				const previousStatusValue = state.subscriptionsApp.subscriptions.subscriptionDialogue.data.status_value;
				return subscription.status_value !== previousStatusValue
					? axios.patch(
							`/subscription/${subscriptionId}/${subscription.status_value ? 'publish' : 'unpublish'}`
					  )
					: Promise.resolve();
			})
			.then(() => {
				dispatch(getSubscriptions());
				dispatch(showMessage({ message: 'Subscription updated successfully' }));
			})
			.finally(() => {
				if (payload.closeNewPackageDialog) {
					dispatch(closeNewSubscriptionDialog());
				}
			});
	}
);

const subscriptionsAdapter = createEntityAdapter({ selectId: subscription => subscription.subscription_id });

export const {
	selectAll: selectSubscriptions,
	selectEntities: selectSubscriptionsEntities,
	selectById: selectSubscriptionById
} = subscriptionsAdapter.getSelectors(state => state.subscriptionsApp.subscriptions);

const subscriptionsSlice = createSlice({
	name: 'subscriptionsApp/subscriptions',
	initialState: subscriptionsAdapter.getInitialState({
		selectedItemId: null,
		selectedItemDetail: null,
		count: null,
		params: {
			page: 1,
			limit: 10
		},
		subscriptionDialogue: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			submitting: false,
			errors: {}
		}
	}),
	reducers: {
		setSelectedItem: (state, action) => {
			state.selectedItemId = action.payload;
		},
		setParams: (state, action) => {
			state.params = action.payload;
		},
		closeEditSubscriptionDialog: state => {
			state.subscriptionDialogue.props.open = false;
		},
		closeNewSubscriptionDialog: state => {
			state.subscriptionDialogue.props.open = false;
		},
		openEditSubscriptionDialog: (state, action) => {
			const { payload } = action;
			state.subscriptionDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					subscription_id: payload.subscription_id,
					entity_id: payload.entity_id,
					subscription_duration: payload.subscription_duration,
					current_price: payload.current_price,
					initial_price: payload.initial_price,
					status_value: payload.status_value,
					serving_priority: payload.serving_priority
				},
				submitting: false,
				errors: {}
			};
		},
		openNewSubscriptionDialog: state => {
			state.subscriptionDialogue.data = {};
			state.subscriptionDialogue.props.open = true;
			state.subscriptionDialogue.submitting = false;
			state.subscriptionDialogue.type = 'new';
		}
	},
	extraReducers: {
		[getSubscriptions.fulfilled]: subscriptionsAdapter.setAll,
		[getSubscriptionsCount.fulfilled]: (state, action) => {
			state.count = action.payload;
		},
		[deleteSubscription.pending]: (state, action) => {
			subscriptionsAdapter.removeOne(state, action.meta.arg);
		},
		[addSubscription.pending]: state => {
			state.subscriptionDialogue.submitting = true;
		},
		[addSubscription.fulfilled]: state => {
			state.subscriptionDialogue.submitting = false;
			state.subscriptionDialogue.props.open = false;
		},
		[addSubscription.pending]: state => {
			state.subscriptionDialogue.submitting = true;
		}
	}
});

export const {
	setSelectedItem,
	setParams,
	closeEditSubscriptionDialog,
	closeNewSubscriptionDialog,
	openEditSubscriptionDialog,
	openNewSubscriptionDialog
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
