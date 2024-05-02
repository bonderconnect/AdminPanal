import axios from 'app/utils/axios';
import helpers from 'app/utils/helpers';

const getExams = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/learning-material/exams',
				params: requestOptions.params
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const createExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/learning-material/exam',
				data: requestOptions.data,
				method: 'POST'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const updateExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam`,
				data: requestOptions.data,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamsCount = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: '/learning-material/exams/count',
				params: requestOptions.params
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const publishExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/publish`,
				params: requestOptions.params,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const unpublishExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/unpublish`,
				params: requestOptions.params,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam`
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const createExamQuestion = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question`,
				data: requestOptions.data,
				method: 'POST'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const updateExamQuestion = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question/${requestOptions.urlParams.learningMaterialExamQuestionId}`,
				data: requestOptions.data,
				method: 'PATCH'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamQuestions = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/questions-paginated`,
				params: requestOptions.params
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamQuestionsAll = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/questions-all`,
				params: requestOptions.params
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamQuestionsCount = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/questions/count`,
				params: requestOptions.params
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamQuestionsAnswers = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question-answers`
			})
			.then(response => helpers.parseApiResponse(response, { returnArray: true }), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const createExamQuestionOption = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question/${requestOptions.urlParams.learningMaterialExamQuestionId}/option`,
				method: 'POST',
				data: requestOptions.data
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const updateExamQuestionOption = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question/${requestOptions.urlParams.learningMaterialExamQuestionId}/option/${requestOptions.urlParams.learningMaterialExamQuestionOptionId}`,
				method: 'PATCH',
				data: requestOptions.data
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const deleteExamQuestionOption = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question/${requestOptions.urlParams.learningMaterialExamQuestionId}/option/${requestOptions.urlParams.learningMaterialExamQuestionOptionId}`,
				method: 'DELETE'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const deleteExamQuestion = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/question/${requestOptions.urlParams.learningMaterialExamQuestionId}`,
				method: 'DELETE'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const deleteExam = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam`,
				method: 'DELETE'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const isExamAbleToUpdate = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/is-update-possible`
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const deleteExplainerVideo = requestOptions => {
	return new Promise((resolve, reject) =>
		axios
			.request({
				url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/explainer-video`,
				method: 'DELETE'
			})
			.then(response => helpers.parseApiResponse(response), helpers.parseApiResponse)
			.then(result => (!result.error ? resolve(result) : reject(result)))
	);
};

const getExamUserAttempts = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/user-attempts-of-all-users`,
		params: requestOptions.params
	});

const getExamUserAttemptsExcelReportDownloadUrl = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/user-attempts-of-all-users/excel-report`,
		params: requestOptions.params
	});

const getExamUserAttempt = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/user-attempt/${requestOptions.urlParams.userAttemptId}`,
		params: requestOptions.params
	});

const getChoosedOptions = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/user-attempt/${requestOptions.urlParams.userAttemptId}/questions-choosed-options`,
		params: requestOptions.params
	});

const updateEvaluation = requestOptions =>
	axios.request({
		url: `/learning-material/${requestOptions.urlParams.learningMaterialId}/exam/user-attempt/${requestOptions.urlParams.userAttemptId}/update-evaluation`,
		data: requestOptions.data,
		method: 'POST'
	});

export {
	getExams,
	getExamsCount,
	publishExam,
	unpublishExam,
	createExam,
	getExam,
	updateExam,
	getExamQuestions,
	getExamQuestionsAnswers,
	createExamQuestion,
	updateExamQuestion,
	getExamQuestionsCount,
	createExamQuestionOption,
	updateExamQuestionOption,
	deleteExamQuestionOption,
	deleteExamQuestion,
	deleteExam,
	isExamAbleToUpdate,
	deleteExplainerVideo,
	getExamUserAttempts,
	getExamUserAttempt,
	getExamUserAttemptsExcelReportDownloadUrl,
	getExamQuestionsAll,
	getChoosedOptions,
	updateEvaluation
};
