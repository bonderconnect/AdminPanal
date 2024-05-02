import { combineReducers } from '@reduxjs/toolkit';
import categories from './categorySlice';
import packages from './packageSlice';
import exams from './examsSlice';
import examQuestions from './examQuestionsSlice';
import examDialogue from './examDialogueSlice';
import exam from './exam';
import questions from './questionsSlice';
import evaluation from './evaluationSlice';

const reducer = combineReducers({
	packages,
	categories,
	exam,
	exams,
	examQuestions,
	examDialogue,
	evaluation,
	questions
});

export default reducer;
