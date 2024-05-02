import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import * as examApi from 'app/services/apiServices/exam';
// eslint-disable-next-line import/no-cycle
import { publishExam, unpublishExam } from './examQuestionsSlice';

export const getExams = createAsyncThunk('examApp/exams/getExams', async (params, { dispatch, getState }) => {
	params = params || getState().examApp.exams.params;
	dispatch(getExamsCount(params));
	dispatch(setExamsParams(params));
	const response = await examApi.getExams({
		params
	});
	const { data } = response;
	const loading = false;
	return { data, loading };
});

export const getExamsCount = createAsyncThunk('examApp/exams/getExamsCount', async (params, { getState }) => {
	params = params || getState().examApp.exams.params;
	const updatedParams = { ...params };
	delete updatedParams.page;
	delete updatedParams.limit;
	const response = await examApi.getExamsCount({
		params: updatedParams
	});
	const { data } = response;

	return data;
});

export const duplicateExam = createAsyncThunk('examApp/exam/duplicateVideo', async (materialId, { dispatch }) => {
	dispatch(setItemsDuplicationInProgress(materialId));
	await axios.post(`/learning-material/${materialId}/duplicate`);

	dispatch(showMessage({ message: 'video duplicated successfully!' }));
	dispatch(getExams());
});

const examsAdapter = createEntityAdapter({
	selectId: exam => exam.learning_material_id
});

export const { selectAll: selectExams, selectById: selectExamById } = examsAdapter.getSelectors(
	state => state.examApp.exams
);

const examsSlice = createSlice({
	name: 'examApp/exams',
	initialState: examsAdapter.getInitialState({
		searchText: '',
		loading: false,
		params: {
			page: 1,
			limit: 10,
			sort_by: 'created_date',
			sort_dir: 'desc'
		},
		count: null,
		itemDuplicationInProgress: [],
		itemsStatusInChangeProgress: [] // To show progress in publishing / unpublishing
	}),
	reducers: {
		setExamsSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		setExamsParams: (state, action) => {
			state.params = action.payload;
		},
		setExamsLoading: (state, action) => {
			state.loading = action.payload;
		},
		setExamsCount: (state, action) => {
			state.count = action.payload;
		},
		setItemsStatusInChangeProgress: (state, action) => {
			state.itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress, action.payload];
		},
		setItemsDuplicationInProgress: (state, action) => {
			state.itemDuplicationInProgress = [...state.itemDuplicationInProgress, action.payload];
		}
	},
	extraReducers: {
		[getExams.pending]: (state, action) => {
			state.loading = true;
		},
		[getExams.fulfilled]: (state, action) => {
			const { data, params, loading } = action.payload;
			examsAdapter.setAll(state, data);
			state.loading = loading;
			state.searchText = '';
		},
		[getExamsCount.fulfilled]: (state, action) => {
			state.count = action.payload;
		},
		[publishExam.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			examsAdapter.updateOne(state, { id: materialId, changes: { status_value: 1 } });
		},
		[unpublishExam.fulfilled]: (state, action) => {
			const itemsStatusInChangeProgress = [...state.itemsStatusInChangeProgress];
			const materialId = action.payload;
			const foundIndex = itemsStatusInChangeProgress.indexOf(materialId);
			itemsStatusInChangeProgress.splice(foundIndex, 1);
			state.itemsStatusInChangeProgress = itemsStatusInChangeProgress;
			examsAdapter.updateOne(state, { id: materialId, changes: { status_value: 0 } });
		},
		[duplicateExam.fulfilled]: (state, action) => {
			const itemDuplicationInProgress = [...state.itemDuplicationInProgress];
			const materialId = action.payload;
			const foundIndex = itemDuplicationInProgress.indexOf(materialId);
			itemDuplicationInProgress.splice(foundIndex, 1);
			state.itemDuplicationInProgress = itemDuplicationInProgress;
		}
	}
});

export const {
	setExamsParams,
	setExamsSearchText,
	setItemsStatusInChangeProgress,
	setItemsDuplicationInProgress
} = examsSlice.actions;

export default examsSlice.reducer;
