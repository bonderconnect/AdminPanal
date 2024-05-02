import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

export const getQuestionsWithAnswers = createAsyncThunk('examApp/questions/getQuestions', async learningMaterialId => {
	const [questionsResponse, questionAnswersResponse] = await Promise.all([
		axios.get(`/learning-material/${learningMaterialId}/exam/questions`),
		axios.get(`/learning-material/${learningMaterialId}/exam/question-answers`)
	]);
	const questions = questionsResponse.data && questionsResponse.data.data;
	const questionAnswers = questionAnswersResponse.data && questionAnswersResponse.data.data;

	const questionIdWithAnswerId = {};
	questionAnswers.forEach(element => {
		questionIdWithAnswerId[element.learning_material_exam_question_id] = element.id;
	});

	questions.forEach(questionElement => {
		// const updatedQuestionElement = { ...questionElement };
		if (questionElement.options) {
			questionElement.options.forEach(optionElement => {
				if (optionElement.id === questionIdWithAnswerId[questionElement.id]) {
					optionElement.is_right_option = true;
				}
			});
		}
	});

	return questions;
});

export const updateQuestions = createAsyncThunk('examApp/questions/updateQuestions', async (payload, { dispatch }) => {
	const { learningMaterialId } = payload;
	const updatedQuestions = payload.updatedQuestionsArr;

	await axios.post(`/learning-material/${learningMaterialId}/exam/questions-update-individually`, updatedQuestions);
	if (!payload.isAutoSave) {
		dispatch(showMessage({ message: 'Questions updated successfully' }));
	}
});

const questionsAdapter = createEntityAdapter({});
const initialState = questionsAdapter.getInitialState({
	loading: false,
	updating: false,
	autoSaving: false
});

export const { selectAll: selectAllQuestions } = questionsAdapter.getSelectors(state => {
	return state.examApp.questions;
});

const questionsSlice = createSlice({
	name: 'examApp/questions',
	initialState,
	reducers: {},
	extraReducers: {
		[getQuestionsWithAnswers.pending]: (state, action) => {
			state.loading = true;
		},
		[getQuestionsWithAnswers.fulfilled]: (state, action) => {
			state.loading = false;
			questionsAdapter.setAll(state, action.payload);
		},
		[updateQuestions.pending]: (state, action) => {
			if (action?.meta?.arg?.isAutoSave) {
				state.autoSaving = true;
			} else {
				state.updating = true;
			}
		},
		[updateQuestions.fulfilled]: (state, action) => {
			if (action?.meta?.arg?.isAutoSave) {
				state.autoSaving = false;
			} else {
				state.updating = false;
			}
		}
	}
});

export default questionsSlice.reducer;
