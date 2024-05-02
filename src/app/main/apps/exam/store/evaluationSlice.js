import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import * as examApi from 'app/services/apiServices/exam';

export const getExam = createAsyncThunk('examsApp/evaluation/getExam', async learningMaterialId => {
	const examResponse = await examApi.getExam({
		urlParams: {
			learningMaterialId
		}
	});

	const { data: exam } = examResponse;
	return exam;
});

export const getUserAttempt = createAsyncThunk('examsApp/evaluation/getUserAttempt', async payload => {
	const examUserAttemptResponse = await examApi.getExamUserAttempt({
		urlParams: {
			learningMaterialId: payload.learningMaterialId,
			userAttemptId: payload.attemptId
		}
	});
	const { data: examUserAttemptData } = examUserAttemptResponse;
	const examUserAttempt = examUserAttemptData.data && examUserAttemptData.data[0];
	return examUserAttempt;
});

export const getQuestions = createAsyncThunk('examsApp/evaluation/getQuestions', async learningMaterialId => {
	const examQuestionsResponse = await examApi.getExamQuestionsAll({
		urlParams: {
			learningMaterialId
		}
	});

	const { data: questions } = examQuestionsResponse;
	return questions;
});

export const getChoosedOptions = createAsyncThunk('examsApp/evaluation/getChoosedOptions', async payload => {
	const getChoosedOptionsResponse = await examApi.getChoosedOptions({
		urlParams: {
			learningMaterialId: payload.learningMaterialId,
			userAttemptId: payload.attemptId
		}
	});

	const choosedOptions = getChoosedOptionsResponse.data && getChoosedOptionsResponse.data.data;
	return choosedOptions;
});

export const getQuestionAnswers = createAsyncThunk(
	'examsApp/evaluation/getQuestionAnswers',
	async learningMaterialId => {
		const getQuestionAnswersResponse = await examApi.getExamQuestionsAnswers({
			urlParams: {
				learningMaterialId
			}
		});
		const questionAnswers = getQuestionAnswersResponse.data;
		return questionAnswers;
	}
);

export const updateEvaluation = createAsyncThunk(
	'examsApp/evaluation/updateEvaluation',
	async (payload, { getState, dispatch }) => {
		const state = getState();
		const learningMaterialId = state.examApp.evaluation.exam.learning_material_id;
		const userAttemptId = state.examApp.evaluation.userAttempt.id;

		const requestData = {
			questions: payload.evaluationQuestions,
			evaluation_completed: payload.isMarkedAsEvaluated
		};
		await examApi.updateEvaluation({ urlParams: { learningMaterialId, userAttemptId }, data: requestData });

		// checking if notification need to send
		const { evaluated } = state.examApp.evaluation.userAttempt;
		if (!evaluated && payload.isMarkedAsEvaluated) {
			// Send notification to users
		}

		dispatch(showMessage({ message: 'Evaluation updated successfully' }));

		return null;
	}
);

const questionAdapter = createEntityAdapter({});
const choosedOptionsAdapter = createEntityAdapter({
	selectId: choosedOption => choosedOption.learning_material_exam_question_id
});
const questionAnswersAdapter = createEntityAdapter({
	selectId: questionAnswer => questionAnswer.learning_material_exam_question_id
});

export const { selectAll: selectAllQuestions, selectById: selectQuestionById } = questionAdapter.getSelectors(
	state => state.examApp.evaluation.questions
);

export const {
	selectAll: selectAllChoosedOptions,
	selectById: selectChoosedOptionByQuestionId
} = choosedOptionsAdapter.getSelectors(state => state.examApp.evaluation.choosedOptions);

export const { selectById: selectQuestionAnswerByQuestionId } = choosedOptionsAdapter.getSelectors(
	state => state.examApp.evaluation.questionAnswers
);

const initialState = {
	loading: true,
	exam: null,
	questions: questionAdapter.getInitialState({}),
	choosedOptions: choosedOptionsAdapter.getInitialState({}),
	questionAnswers: questionAnswersAdapter.getInitialState({}),
	userAttempt: null,
	updateEvaluationProgressing: false
};

const evaluationSlice = createSlice({
	name: 'examApp/exams',
	initialState,
	reducers: {},
	extraReducers: {
		[getExam.fulfilled]: (state, action) => {
			state.loading = false;
			state.exam = action.payload;
		},
		[getUserAttempt.fulfilled]: (state, action) => {
			state.userAttempt = action.payload;
		},
		[getQuestions.fulfilled]: (state, action) => {
			const questions = action.payload;
			state.questions = questionAdapter.setAll(state.questions, questions);
		},
		[getChoosedOptions.fulfilled]: (state, action) => {
			const choosedOptions = action.payload;
			state.choosedOptions = choosedOptionsAdapter.setAll(state.choosedOptions, choosedOptions);
		},
		[getChoosedOptions.fulfilled]: (state, action) => {
			const choosedOptions = action.payload;
			state.choosedOptions = choosedOptionsAdapter.setAll(state.choosedOptions, choosedOptions);
		},
		[getQuestionAnswers.fulfilled]: (state, action) => {
			const questionAnswers = action.payload;
			state.questionAnswers = questionAnswersAdapter.setAll(state.questionAnswers, questionAnswers);
		},
		[updateEvaluation.pending]: state => {
			state.updateEvaluationProgressing = true;
		},
		[updateEvaluation.fulfilled]: state => {
			state.updateEvaluationProgressing = false;
		}
	}
});

export default evaluationSlice.reducer;
