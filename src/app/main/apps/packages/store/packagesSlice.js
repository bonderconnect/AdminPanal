import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getPackages = createAsyncThunk('packagesApp/packages/getPackages', async (_, { dispatch, getState }) => {
	dispatch(getPackagesCount());
	const { params } = getState().packagesApp.packages;
	const response = await axios
		.get('/packages', { params })
		.then(axiosResponse => helpers.parseApiResponse(axiosResponse, { returnArray: true }));
	const { data } = response;

	return data;
});

export const getPackagesCount = createAsyncThunk(
	'packagesApp/packages/getPackagesCount',
	async (
		_
		// { getState }
	) => {
		// const { params } = getState().packagesApp.packages;
		const response = await axios.get('/packages/count').then(helpers.parseApiResponse);
		const { data } = response;

		return data;
	}
);

export const addPackage = createAsyncThunk(
	'packagesApp/packages/addPackage',
	async (payload, { dispatch, getState }) => {
		const package_ = payload.package;
		const createPackagePayload = {
			title: package_.title,
			description: package_.description
		};
		return axios
			.post('/package', createPackagePayload)
			.then(helpers.parseApiResponse, () => {
				dispatch(showMessage({ message: 'Package added failed' }));
				return Promise.reject(new Error('Package added failed'));
			})
			.then(() => {
				dispatch(getPackages());
				dispatch(showMessage({ message: 'Package added successfully' }));
			})
			.finally(() => {
				if (payload.closeNewPackageDialog) {
					dispatch(closeNewPackageDialog());
				}
			});
	}
);

export const updatePackage = createAsyncThunk('packagesApp/packages/updatePackage', async (payload, { dispatch }) => {
	const package_ = payload.package;
	await axios.patch(`/package/${payload.package_id}`, package_).then(helpers.parseApiResponse);
	dispatch(showMessage({ message: 'Package updated successfully' }));
	dispatch(getPackages());
});

export const deletePackage = createAsyncThunk(
	'packagesApp/packages/deletePackage',
	async (packageId, { dispatch, getState }) => {
		return axios
			.delete(`/package/${packageId}`)
			.then(helpers.parseApiResponse, helpers.parseApiResponse)
			.then(result => {
				if (result.error) {
					dispatch(showMessage({ message: result.error }));
				} else {
					dispatch(showMessage({ message: 'Package deleted successfully' }));
				}
			})
			.finally(() => dispatch(getPackages()));
	}
);

const packagesAdapter = createEntityAdapter({ selectId: package_ => package_.package_id });

export const {
	selectAll: selectPackages,
	selectEntities: selectPackagesEntities,
	selectById: selectPackageById
} = packagesAdapter.getSelectors(state => state.packagesApp.packages);

const packagesSlice = createSlice({
	name: 'packagesApp/packages',
	initialState: packagesAdapter.getInitialState({
		selectedItemId: null,
		selectedItemDetail: null,
		count: null,
		params: {
			page: 1,
			limit: 10
		},
		packageDialogue: {
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
		closeEditPackageDialog: state => {
			state.packageDialogue.props.open = false;
		},
		closeNewPackageDialog: state => {
			state.packageDialogue.props.open = false;
		},
		openEditPackageDialog: (state, action) => {
			const { payload } = action;
			state.packageDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					package_id: payload.package_id,
					title: payload.package_title,
					description: payload.package_description,
					status_value: payload.status_value
				},
				submitting: false,
				errors: {}
			};
		},
		openNewPackageDialog: state => {
			state.packageDialogue.data = {};
			state.packageDialogue.props.open = true;
			state.packageDialogue.submitting = false;
			state.packageDialogue.type = 'new';
		}
	},
	extraReducers: {
		[getPackages.fulfilled]: packagesAdapter.setAll,
		[getPackagesCount.fulfilled]: (state, action) => {
			state.count = action.payload;
		},
		[addPackage.pending]: state => {
			state.packageDialogue.submitting = true;
		},
		[addPackage.rejected]: state => {
			state.packageDialogue.submitting = false;
			state.packageDialogue.props.open = false;
		},
		[deletePackage.pending]: (state, action) => {
			packagesAdapter.removeOne(state, action.meta.arg);
		}
	}
});

export const {
	setSelectedItem,
	setParams,
	closeEditPackageDialog,
	closeNewPackageDialog,
	openEditPackageDialog,
	openNewPackageDialog
} = packagesSlice.actions;

export default packagesSlice.reducer;
