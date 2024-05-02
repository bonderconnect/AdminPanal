import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as examApi from 'app/services/apiServices/exam';

export const getExamUserAttempts = createAsyncThunk(
	'examApp/exam/attempts/getExamUserAttempts',
	async (learningMaterialId, { getState, dispatch }) => {
		const state = getState();
		const { params } = state.examApp.exam.attempts;
		const result = await examApi.getExamUserAttempts({
			params,
			urlParams: {
				learningMaterialId
			}
		});

		const data = result.data && result.data.data;
		const learningMaterialExamUserAttemptsOfAllUsers = data.learning_material_exam_user_attempts_of_all_users;
		const meta = data.page;
		dispatch(setMeta(meta));
		return learningMaterialExamUserAttemptsOfAllUsers;
	}
);

export const getExamUserAttemptsExcelExportDownloadUrl = createAsyncThunk(
	'examApp/exam/attempts/getExamUserAttemptsExcelExportDownloadUrl',
	async learningMaterialId => {
		const result = await examApi.getExamUserAttemptsExcelReportDownloadUrl({
			urlParams: {
				learningMaterialId
			}
		});

		const data = result.data && result.data.data;
		return data.download_url;
	}
);

const initialState = {
	params: {
		page: 1,
		limit: 10,
		search: ''
	},
	list: {
		loading: true,
		data: null
	},
	excelExport: {
		downloadUrl: null,
		loading: false
	},
	meta: {}
};

const examAttemptsSlice = createSlice({
	name: 'examApp/exam/attempts',
	initialState,
	reducers: {
		reset: () => {
			return initialState;
		},
		setMeta: (state, action) => {
			state.meta = action.payload;
		},
		setParams: (state, action) => {
			state.params = action.payload;
		},
		resetExcelExportDownloadUrl: state => {
			state.excelExport.downloadUrl = null;
		}
	},
	extraReducers: {
		[getExamUserAttempts.fulfilled]: (state, action) => {
			state.list.data = action.payload;
			state.list.loading = false;
		},
		[getExamUserAttempts.pending]: state => {
			state.list.loading = true;
		},
		[getExamUserAttemptsExcelExportDownloadUrl.pending]: state => {
			state.excelExport.loading = true;
		},
		[getExamUserAttemptsExcelExportDownloadUrl.fulfilled]: (state, action) => {
			state.excelExport.downloadUrl = action.payload;
			state.excelExport.loading = false;
		}
	}
});

export const { reset, setMeta, setParams, resetExcelExportDownloadUrl } = examAttemptsSlice.actions;
export default examAttemptsSlice.reducer;
