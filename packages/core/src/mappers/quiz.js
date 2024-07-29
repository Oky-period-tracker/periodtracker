"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromQuizzes = fromQuizzes;
function fromQuizzes(response) {
    const quizzes = response.reduce((data, quiz) => ({
        byId: Object.assign(Object.assign({}, data.byId), { [quiz.id]: {
                id: quiz.id,
                isAgeRestricted: quiz.isAgeRestricted,
                question: quiz.question,
                answers: [
                    { text: quiz.option1, emoji: '', isCorrect: quiz.right_answer === '1' },
                    { text: quiz.option2, emoji: '', isCorrect: quiz.right_answer === '2' },
                    { text: quiz.option3, emoji: '', isCorrect: quiz.right_answer === '3' },
                ],
                response: {
                    correct: quiz.right_answer_response,
                    in_correct: quiz.wrong_answer_response,
                },
            } }),
        allIds: data.allIds.concat(quiz.id),
    }), { byId: {}, allIds: [] });
    return { quizzes };
}
//# sourceMappingURL=quiz.js.map