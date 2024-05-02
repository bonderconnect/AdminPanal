import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as examApi from 'app/services/apiServices/exam';

export const getExam = createAsyncThunk('examsApp/exam/detail/getExam', async learningMaterialId => {
	const examResponse = await examApi.getExam({
		urlParams: {
			learningMaterialId
		}
	});

	const { data: exam } = examResponse;
	return exam;
});

const initialState = {
	loading: true,
	data: null
};

const examDetailSlice = createSlice({
	name: 'examsApp/exam/detail',
	initialState,
	reducers: {
		reset: () => initialState
	},
	extraReducers: {
		[getExam.fulfilled]: (state, action) => {
			state.loading = false;
			state.data = action.payload;
		}
	}
});

export const { reset } = examDetailSlice.actions;
export default examDetailSlice.reducer;
