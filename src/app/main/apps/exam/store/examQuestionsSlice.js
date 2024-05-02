import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/utils/axios';
import axiosDefault from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import * as examApi from 'app/services/apiServices/exam';
import helpers from 'app/utils/helpers';
// eslint-disable-next-line import/no-cycle
import { getExams, setItemsStatusInChangeProgress } from './examsSlice';

export const getExam = createAsyncThunk('examApp/examQuestions/getExam', async (payload, { dispatch }) => {
	const { learningMaterialId } = payload;
	const examResponse = await examApi.getExam({
		urlParams: {
			learningMaterialId
		}
	});

	const { data: exam } = examResponse;
	return exam;
});

export const getExamQuestions = createAsyncThunk(
	'examApp/examQuestions/getExamQuestions',
	async (payload, { getState }) => {
		const { learningMaterialId, params: payloadParams } = payload;
		const params = payloadParams || getState().examApp.examQuestions.params;

		const [examQuestionsResponse, examQuestionsAnswersResponse] = await Promise.all([
			examApi.getExamQuestions({
				urlParams: {
					learningMaterialId
				},
				params
			}),
			examApi.getExamQuestionsAnswers({
				urlParams: {
					learningMaterialId
				}
			})
		]);
		const { data: examQuestions } = examQuestionsResponse;
		const { data: examQuestionsAnswersData } = examQuestionsAnswersResponse;
		const examQuestionsAnswers = {};
		examQuestionsAnswersData.forEach(element => {
			examQuestionsAnswers[element.learning_material_exam_question_id] = element.id;
		});

		return { examQuestions, examQuestionsAnswers };
	}
);

export const getExamQuestionsCount = createAsyncThunk(
	'examApp/examQuestions/getExamQuestionsCount',
	async (params, { getState }) => {
		params = params || getState().examApp.examQuestions.params;
		const updatedParams = { ...params };
		delete updatedParams.page;
		delete updatedParams.limit;
		const response = await examApi.getExamQuestionsCount({
			params: updatedParams
		});
		const { data } = response;

		return data;
	}
);

export const addExamQuestion = createAsyncThunk(
	'examApp/examQuestions/addExamQuestion',
	async (payload, { getState, dispatch }) => {
		const { learningMaterialId, question, callback } = payload;
		const examQuestionsResponse = await examApi.createExamQuestion({
			urlParams: {
				learningMaterialId
			},
			data: question
		});

		const { data } = examQuestionsResponse;

		if (callback) {
			callback();
		}

		return data;
	}
);

export const updateExamQuestion = createAsyncThunk(
	'examApp/examQuestions/updateExamQuestion',
	async (payload, { getState, dispatch }) => {
		const { learningMaterialId, learningMaterialExamQuestionId, question, callback } = payload;
		const examQuestionsResponse = await examApi.updateExamQuestion({
			urlParams: {
				learningMaterialId,
				learningMaterialExamQuestionId
			},
			data: question
		});

		const { data } = examQuestionsResponse;

		if (callback) {
			callback();
		}

		return data;
	}
);

export const updateExamQuestionOptions = createAsyncThunk(
	'examApp/examQuestions/updateExamQuestionOptions',
	async (payload, { dispatch }) => {
		const {
			learningMaterialId,
			learningMaterialExamQuestionId,
			newOptions,
			updatedOptions,
			removedOptionsIds,
			callback
		} = payload;

		const promises = [];

		const isUpdatePossible = await examApi
			.isExamAbleToUpdate({
				urlParams: {
					learningMaterialId
				}
			})
			.then(response => response.data);

		if (isUpdatePossible) {
			newOptions.forEach(item => {
				promises.push(
					examApi.createExamQuestionOption({
						urlParams: {
							learningMaterialId,
							learningMaterialExamQuestionId
						},
						data: item
					})
				);
			});

			updatedOptions.forEach(item => {
				const learningMaterialExamQuestionOptionId = item.id;
				delete item.id;
				promises.push(
					examApi.updateExamQuestionOption({
						urlParams: {
							learningMaterialId,
							learningMaterialExamQuestionId,
							learningMaterialExamQuestionOptionId
						},
						data: item
					})
				);
			});

			removedOptionsIds.forEach(removedOptionId => {
				const learningMaterialExamQuestionOptionId = removedOptionId;
				promises.push(
					examApi.deleteExamQuestionOption({
						urlParams: {
							learningMaterialId,
							learningMaterialExamQuestionId,
							learningMaterialExamQuestionOptionId
						}
					})
				);
			});

			await Promise.all(promises).then(() => {
				dispatch(showMessage({ message: 'Question options updated successfully' }));
			});
		} else {
			dispatch(
				showMessage({
					message: 'Unable to update the exam, Already attended by a user',
					variant: 'error'
				})
			);
		}

		if (callback) {
			callback();
		}

		return true;
	}
);

export const publishExam = createAsyncThunk('examApp/examQuestions/publishExam', async (materialId, { dispatch }) => {
	dispatch(setItemsStatusInChangeProgress(materialId));
	const response = await axios.patch(`/learning-material/${materialId}/exam/publish`);
	const data = await response.data;

	dispatch(showMessage({ message: 'Exam published' }));
	return materialId;
});

export const unpublishExam = createAsyncThunk(
	'examApp/examQuestions/unpublishExam',
	async (materialId, { dispatch }) => {
		dispatch(setItemsStatusInChangeProgress(materialId));
		const response = await axios.patch(`/learning-material/${materialId}/exam/unpublish`);
		const data = await response.data;

		dispatch(showMessage({ message: 'Exam unpublished' }));
		return materialId;
	}
);

export const removeExam = createAsyncThunk(
	'examApp/examQuestions/removeExam',
	async (learningMaterialId, { getState, dispatch }) => {
		await examApi
			.deleteExam({
				urlParams: {
					learningMaterialId
				}
			})
			.then(
				() => dispatch(showMessage({ message: 'Material deleted' })),
				error =>
					dispatch(showMessage({ message: `Material not deleted, ${error.error.message}`, variant: 'error' }))
			);
		dispatch(getExams());
	}
);

export const removeExamQuestion = createAsyncThunk(
	'examApp/examQuestions/removeExamQuestion',
	async (payload, { getState, dispatch }) => {
		const { learningMaterialId, learningMaterialExamQuestionId } = payload;

		await examApi
			.deleteExam({
				urlParams: {
					learningMaterialId,
					learningMaterialExamQuestionId
				}
			})
			.then(
				() => dispatch(showMessage({ message: 'Question deleted' })),
				error =>
					dispatch(showMessage({ message: `Question not deleted, ${error.error.message}`, variant: 'error' }))
			);
		dispatch(getExams());
	}
);

export const updateExplainerVideo = createAsyncThunk(
	'examApp/examQuestions/updateExplainerVideo',
	async (payload, { dispatch, getState }) => {
		const { file, callback, learningMaterialId } = payload;

		// Creating cancel request token
		const { CancelToken } = axiosDefault;
		axios.isCancel = axiosDefault.isCancel;
		const cancelToken = new CancelToken(c => {
			// An executor function receives a cancel function as a parameter
			if (typeof window.axiosCancelReference === 'undefined') {
				window.axiosCancelReference = {};
			}
			window.axiosCancelReference['videoApp/videoDialogue/updateVideo'] = c;
		});

		const fileUploadPayload = new FormData();
		fileUploadPayload.append('file', file);
		let isUploadProgressSet = false;
		await axios
			.patch(`learning-material/${learningMaterialId}/exam/explainer-video`, fileUploadPayload, {
				cancelToken,
				onUploadProgress: evt => {
					if (!isUploadProgressSet) {
						dispatch(setExplainerVideoUploadInProgress((isUploadProgressSet = true)));
					}
					let percentComplete = evt.loaded / evt.total;
					percentComplete = Number(percentComplete * 100).toFixed(2);
					dispatch(setExplainerVideoUploadPercentage(percentComplete));
				},
				headers: { 'content-type': 'multipart/form-data' }
			})
			.then(axiosResponse => helpers.parseApiResponse(axiosResponse))
			.catch(() => {
				const state = getState();
				const dialogueErrors = { ...state.errors };
				dialogueErrors.file = { error: 'Unexpect error on uploading file, please try again later' };
				dispatch(setExplainerVideoUploadErrors(dialogueErrors));
			});

		dispatch(showMessage({ message: 'Explainer video uploaded successfully' }));
		if (callback) {
			callback();
		}
	}
);

export const deleteExplainerVideo = createAsyncThunk(
	'examApp/examQuestions/deleteExplainerVideo',
	async (payload, { getState, dispatch }) => {
		const { learningMaterialId, callback } = payload;

		await examApi
			.deleteExplainerVideo({
				urlParams: {
					learningMaterialId
				}
			})
			.then(
				() => dispatch(showMessage({ message: 'Explainer video deleted' })),
				error =>
					dispatch(
						showMessage({
							message: `Explainer not video deleted, ${error.error.message}`,
							variant: 'error'
						})
					)
			);
		if (callback) {
			callback();
		}
	}
);

const examQuestionsSlice = createSlice({
	name: 'examApp/examQuestions',
	initialState: {
		learningMaterial: null,
		learningMaterialId: null,
		questions: null,
		questionsAnswers: null,
		loading: false,
		explainerVideo: {
			upload: {
				inProgress: false,
				percentage: null,
				errors: null
			},
			preview: {
				video: null,
				loading: false,
				dialogue: {
					props: {
						open: false
					}
				}
			}
		},
		params: {
			page: 1,
			limit: 10,
			search: ''
		},
		examQuestionDialogue: {
			type: 'new',
			props: {
				open: false
			},
			form: null,
			submitting: false,
			data: null
		},
		examQuestionOptionsDialogue: {
			type: 'new',
			props: {
				open: false
			},
			form: null,
			submitting: false,
			data: null
		}
	},
	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		},
		setQuestions: (state, action) => {
			state.questions = action.payload;
		},
		clearQuestions: state => {
			state.questions = null;
		},
		closeEditExamQuestionDialog: state => {
			state.examQuestionDialogue.props.open = false;
		},
		closeNewExamQuestionDialog: state => {
			state.examQuestionDialogue.props.open = false;
		},
		openEditExamQuestionDialog: (state, action) => {
			const { payload } = action;
			state.examQuestionDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					question_id: payload.id,
					question: payload.question,
					score: payload.score,
					explanation: payload.explanation,
					serving_priority: payload.serving_priority
				},
				submitting: false,
				errors: {}
			};
		},
		openNewExamQuestionDialog: state => {
			state.examQuestionDialogue.data = {};
			state.examQuestionDialogue.props.open = true;
			state.examQuestionDialogue.submitting = false;
			state.examQuestionDialogue.type = 'new';
		},
		closeExamQuestionOptionsDialog: state => {
			state.examQuestionOptionsDialogue.props.open = false;
		},
		openExamQuestionOptionsDialog: (state, action) => {
			const { payload: question } = action;
			let questionAnswerOptionId;
			if (state.questionsAnswers && state.questionsAnswers[question.id]) {
				questionAnswerOptionId = state.questionsAnswers[question.id];
			}
			state.examQuestionOptionsDialogue = {
				type: 'edit',
				props: {
					open: true
				},
				data: {
					options: question.options,
					questionAnswerOptionId,
					learningMaterialExamQuestionId: question.id
				},
				submitting: false,
				errors: {}
			};
		},
		openNewQuestionOptionDialog: state => {
			state.examQuestionOptionDialogue.data = {};
			state.examQuestionOptionDialogue.props.open = true;
			state.examQuestionOptionDialogue.submitting = false;
			state.examQuestionOptionDialogue.type = 'new';
		},
		updateQuestionCount: (state, action) => {
			state.learningMaterial.question_count = action.payload;
		},
		setExplainerVideoUploadInProgress: (state, action) => {
			state.explainerVideo.upload.inProgress = action.payload;
		},
		setExplainerVideoUploadPercentage: (state, action) => {
			state.explainerVideo.upload.percentage = action.payload;
		},
		setExplainerVideoUploadErrors: (state, action) => {
			state.explainerVideo.upload.errors = action.payload;
		},
		closeExplainerVideoPreviewDialog: state => {
			state.explainerVideo.preview.dialogue.props.open = false;
		},
		openExplainerVideoPreview: state => {
			state.explainerVideo.preview.dialogue.props.open = true;
		}
	},
	extraReducers: {
		[getExam.pending]: (state, action) => {
			if (action.meta && !action.meta.arg.hideLoadingIndication) {
				state.loading = true;
			}
		},
		[getExam.fulfilled]: (state, action) => {
			const exam = action.payload;
			state.learningMaterial = exam;
			state.loading = false;
		},
		[getExamQuestions.fulfilled]: (state, action) => {
			const { examQuestions, examQuestionsAnswers } = action.payload;
			state.questions = examQuestions;
			state.questionsAnswers = examQuestionsAnswers;
		},
		[updateExamQuestionOptions.pending]: (state, action) => {
			state.examQuestionOptionsDialogue.submitting = true;
		},
		[updateExamQuestionOptions.rejected]: (state, action) => {
			state.examQuestionOptionsDialogue.submitting = false;
		},
		[updateExplainerVideo.fulfilled]: (state, action) => {
			state.explainerVideo.upload.inProgress = false;
			state.explainerVideo.upload.percentage = null;
		}
	}
});

export const {
	setParams,
	closeEditExamQuestionDialog,
	closeNewExamQuestionDialog,
	openEditExamQuestionDialog,
	openNewExamQuestionDialog,
	closeEditExamQuestionOptionDialog,
	openEditQuestionOptionDialog,
	openNewQuestionOptionDialog,
	updateQuestionCount,
	clearQuestions,
	openExamQuestionOptionsDialog,
	closeExamQuestionOptionsDialog,
	setExplainerVideoUploadInProgress,
	setExplainerVideoUploadPercentage,
	setExplainerVideoUploadErrors,
	closeExplainerVideoPreviewDialog,
	openExplainerVideoPreview
} = examQuestionsSlice.actions;

export default examQuestionsSlice.reducer;
